package com.safehaven.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Incoming DTO for the contact / help-request form.
 * Validated before saving to the database.
 */
public class ContactRequest {

    /** Voluntary name (or safe name). May be blank. */
    private String name;

    /** How the user prefers to be contacted (email, phone, text, none). */
    private String contactMethod;

    /** Contact detail supplied by the user. May be blank. */
    private String contactInfo;

    /** Required message. */
    @NotBlank(message = "Message must not be empty")
    @Size(max = 5000, message = "Message must be at most 5000 characters")
    private String message;

    // ── Getters & Setters ──────────────────────────────────────────────────

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContactMethod() { return contactMethod; }
    public void setContactMethod(String contactMethod) { this.contactMethod = contactMethod; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
