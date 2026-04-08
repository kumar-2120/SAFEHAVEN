package com.safehaven.service;

import com.safehaven.model.ContactRequest;
import com.safehaven.model.ContactSubmission;
import com.safehaven.repository.ContactRepository;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    /**
     * Persists a new help-request submission.
     *
     * @param request validated incoming DTO
     * @return the saved entity
     */
    public ContactSubmission save(ContactRequest request) {
        ContactSubmission submission = new ContactSubmission();
        submission.setName(request.getName());
        submission.setContactMethod(request.getContactMethod());
        submission.setContactInfo(request.getContactInfo());
        submission.setMessage(request.getMessage());
        return contactRepository.save(submission);
    }
}
