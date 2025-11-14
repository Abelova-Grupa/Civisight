package com.abeliangroup.civisight.test;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/public/hello")
    public String publicHello() {
        return "Hello from a public endpoint!";
    }

    @GetMapping("/private/hello")
    public String privateHello() {
        return "Hello from a private endpoint! (Authenticated)";
    }
}
