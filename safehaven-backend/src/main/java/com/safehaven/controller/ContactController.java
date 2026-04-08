package com.safehaven.controller;

import com.safehaven.model.ApiResponse;
import com.safehaven.model.ContactRequest;
import com.safehaven.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST endpoints for the help-request / contact form.
 *
 * POST /api/contact – submit a help request (public)
 *
 * Note: A GET /api/contact admin endpoint is intentionally omitted.
 * Add Spring Security with role-based access control before exposing
 * submission data over HTTP.
 */
@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    /**
     * Accepts a help-request form submission from the frontend.
     *
     * @param request validated request body
     * @return 201 Created with a confirmation message
     */
    @PostMapping
    public ResponseEntity<ApiResponse> submit(@Valid @RequestBody ContactRequest request) {
        contactService.save(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse(true,
                        "Thank you for reaching out. A support coordinator will be in touch soon. "
                        + "Remember – you are not alone."));
    }
}
