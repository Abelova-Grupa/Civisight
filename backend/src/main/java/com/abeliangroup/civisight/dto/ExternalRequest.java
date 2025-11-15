package com.abeliangroup.civisight.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ExternalRequest {

    // Textual description of the problem/request
    private String description;

    // The image data, typically sent as a Base64 encoded string
    // This allows it to be easily included in a JSON or form-data request field.
    private String content;

}
