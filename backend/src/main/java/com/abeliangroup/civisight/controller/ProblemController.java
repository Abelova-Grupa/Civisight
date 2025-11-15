package com.abeliangroup.civisight.controller;

import com.abeliangroup.civisight.dto.IssueDTO;
import com.abeliangroup.civisight.dto.ProblemDTO;
import com.abeliangroup.civisight.dto.SuggestionDTO;
import com.abeliangroup.civisight.model.*;
import com.abeliangroup.civisight.repo.ProblemRepository;
import com.abeliangroup.civisight.repo.CitizenRepository;
import com.abeliangroup.civisight.repo.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemRepository problemRepository;
    private final CitizenRepository citizenRepository;
    private final VoteRepository voteRepository;

    private Citizen getCurrentCitizen() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }

        String email = authentication.getName(); // email is stored as JWT subject
        return citizenRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Citizen not found"));
    }

    @GetMapping("/auth-test")
    @PreAuthorize("hasRole('CITIZEN')")
    public String authTest() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Auth: " + auth);
        System.out.println("Authorities: " + auth.getAuthorities());
        return "Hello, Citizen!";
    }

    // Get all problems
    @GetMapping
    public List<ProblemDTO> getAllProblems() {
        return problemRepository.findAll()
                .stream()
                .map(ProblemDTO::toDTO)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('CITIZEN')")
    @GetMapping("/reported")
    public List<ProblemDTO> getReportedProblems() {
        Citizen citizen = getCurrentCitizen();

        return citizen.getReportedProblems()
                .stream()
                .map(ProblemDTO::toDTO)
                .toList();
    }

    // Get problem by ID
    @GetMapping("/{id}")
    public ProblemDTO getProblemById(@PathVariable Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        return ProblemDTO.toDTO(problem);
    }

    private final String IMAGE_UPLOAD_DIR = "uploads/images"; // local folder

    @PreAuthorize("hasRole('CITIZEN')")
    @PostMapping(value="/suggestion", consumes = "multipart/form-data")
    public SuggestionDTO createSuggestion(
        @RequestParam String description,
        @RequestParam Double latitude,
        @RequestParam Double longitude,
        @RequestParam(required = false) MultipartFile imageFile
    ) throws Exception {

        Citizen citizen = getCurrentCitizen();
        // TODO: Handle non-existing citizen

        Suggestion suggestion = new Suggestion();
        suggestion.setDescription(description);
        suggestion.setAuthor(citizen);
        suggestion.setLatitude(latitude);
        suggestion.setLongitude(longitude);

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = saveImage(imageFile);
            suggestion.setImageUrl("/images/" + fileName); // store relative path
        }

        return SuggestionDTO.toDTO(problemRepository.save(suggestion));
    }

    @PreAuthorize("hasRole('CITIZEN')")
    @PostMapping(value="/issue", consumes = "multipart/form-data")
    public IssueDTO createIssue(
        @RequestParam String description,
        @RequestParam Double latitude,
        @RequestParam Double longitude,
        @RequestParam(required = false) MultipartFile imageFile
    ) throws Exception {
        Citizen citizen = getCurrentCitizen();
        // TODO: Handle non-existing citizen

        Issue issue = new Issue();
        issue.setDescription(description);
        issue.setAuthor(citizen);
        issue.setLatitude(latitude);
        issue.setLongitude(longitude);
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = saveImage(imageFile);
            issue.setImageUrl("/images/" + fileName);
        }

        return IssueDTO.toDTO(problemRepository.save(issue));
    }

    // Helper method to save image
    private String saveImage(MultipartFile file) throws Exception {
        Path uploadPath = Paths.get(IMAGE_UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileExtension = getFileExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + "." + fileExtension;
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        return fileName;
    }

    private String getFileExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    @PostMapping("/{id}/upvote")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<?> upvote(@PathVariable Long id, @RequestParam Boolean value) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Problem not found"));
        Citizen citizen = getCurrentCitizen();

        Vote vote = voteRepository.findByCitizenAndProblem(citizen, problem)
                .orElseGet(() -> {
                    Vote v = new Vote();
                    v.setCitizen(citizen);
                    v.setProblem(problem);
                    v.setUp(false);
                    v.setDown(false);
                    return v;
                });

        if ((value && vote.isUp()) || (!value && vote.isDown())) {
            return ResponseEntity.ok("Already " + (value ? "upvoted" : "downvoted") + "!");
        }

        if (vote.isUp()) problem.setUpvotes(problem.getUpvotes() - 1);
        if (vote.isDown()) problem.setDownvotes(problem.getDownvotes() - 1);

        vote.setUp(value);
        vote.setDown(!value && value != null ? true : false);

        if (value) problem.setUpvotes(problem.getUpvotes() + 1);
        else problem.setDownvotes(problem.getDownvotes() + 1);

        voteRepository.save(vote);
        problemRepository.save(problem);

        return ResponseEntity.ok(
                (value ? "Upvote" : "Downvote") + " " + (value ? "added" : "added") +
                        ". Current count: Upvotes=" + problem.getUpvotes() + ", Downvotes=" + problem.getDownvotes()
        );
    }



    // Adds upvote on true value, otherwise removes upvote
//    @PostMapping("/{id}/upvote")
//    @PreAuthorize("hasRole('CITIZEN')")
//    public boolean upvote(@PathVariable Long id, @RequestParam Boolean value) {
//        Vote vote;
//        Citizen citizen = getCurrentCitizen();
//        Problem problem = problemRepository.findById(id).orElseThrow(IllegalArgumentException::new);
//
//        if(!voteRepository.existsByCitizenIdAndProblemId(citizen.getId(), id)) {
//            vote = new Vote();
//            vote.setCitizen(citizen);
//            vote.setProblem(problem);
//        } else {
//            vote = voteRepository.findByCitizenAndProblem(citizen, problem)
//                .orElseThrow(IllegalArgumentException::new);
//        }
//        vote.setUp(value);
//        if(value){
//            problem.setUpvotes(problem.getUpvotes() + 1);
//        } else problem.setUpvotes(problem.getUpvotes() - 1);
//        problemRepository.save(problem);
//        voteRepository.save(vote);
//        return true;
//    }

    // Adds upvote on true value, otherwise removes upvote
//    @PostMapping("/{id}/downvote")
//    @PreAuthorize("hasRole('CITIZEN')")
//    public boolean downvote(@PathVariable Long id, @RequestParam Boolean value) {
//        Vote vote;
//        Citizen citizen = getCurrentCitizen();
//        Problem problem = problemRepository.findById(id).orElseThrow(IllegalArgumentException::new);
//
//        if(!voteRepository.existsByCitizenIdAndProblemId(citizen.getId(), id)) {
//            vote = new Vote();
//            vote.setCitizen(citizen);
//            vote.setProblem(problem);
//        } else {
//            vote = voteRepository.findByCitizenAndProblem(citizen, problem)
//                .orElseThrow(IllegalArgumentException::new);
//        }
//        vote.setDown(value);
//        if(value){
//            problem.setDownvotes(problem.getDownvotes() + 1);
//        } else problem.setDownvotes(problem.getDownvotes() - 1);
//        problemRepository.save(problem);
//        voteRepository.save(vote);
//        return true;
//    }

    @PostMapping("/{id}/report")
    @PreAuthorize("hasRole('CITIZEN')")
        public ResponseEntity<?> report(@PathVariable Long id) {
            Problem problem = problemRepository.findById(id).orElseThrow(NoSuchElementException::new);
            Citizen citizen = getCurrentCitizen();
            if(citizen.getReportedProblems().contains(problem)) return ResponseEntity.ok("Already reported!");

            citizen.getReportedProblems().add(problem);
            problem.setReports(problem.getReports() + 1);

            citizenRepository.save(citizen);
            problemRepository.save(problem);
            return ResponseEntity.ok("Report saved. Counter increased.");

        }



//    // Upvote a problem
//    @PreAuthorize("hasRole('CITIZEN')")
//    @PostMapping("/{id}/upvote")
//    public Problem upvoteProblem(@PathVariable Long id) {
//        Problem problem = problemRepository.findById(id)
//            .orElseThrow(() -> new RuntimeException("Problem not found"));
//
//        problem.setUpvotes(problem.getUpvotes() + 1);
//        return problemRepository.save(problem);
//    }
//
//    // Downvote a problem
//    @PreAuthorize("hasRole('CITIZEN')")
//    @PostMapping("/{id}/downvote")
//    public Problem downvoteProblem(@PathVariable Long id) {
//        Problem problem = problemRepository.findById(id)
//            .orElseThrow(() -> new RuntimeException("Problem not found"));
//
//        problem.setDownvotes(problem.getDownvotes() + 1);
//        return problemRepository.save(problem);
//    }

    // Admin resolves a problem
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/resolve")
    public ProblemDTO resolveProblem(@PathVariable Long id) {
        Problem problem = problemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Problem not found"));

        problem.setStatus(Status.RESOLVED);
        return ProblemDTO.toDTO(problemRepository.save(problem));
    }

    // Admin cancels a problem
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/cancel")
    public ProblemDTO cancelProblem(@PathVariable Long id) {
        Problem problem = problemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Problem not found"));

        problem.setStatus(Status.CANCELLED);
        return ProblemDTO.toDTO(problemRepository.save(problem));
    }
}
