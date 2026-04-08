package com.safehaven.controller;

import com.safehaven.model.Hotline;
import com.safehaven.service.ResourceService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST endpoints for crisis hotlines / resource data.
 *
 * GET /api/hotlines          – all hotlines
 * GET /api/hotlines?region=X – filter by region
 */
@RestController
@RequestMapping("/api/hotlines")
@CrossOrigin(origins = "*")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    /**
     * Returns crisis hotlines, optionally filtered by region.
     *
     * @param region optional query param (e.g. USA, UK, International)
     * @return list of {@link Hotline} records
     */
    @GetMapping
    public List<Hotline> getHotlines(
            @RequestParam(required = false) String region) {
        return resourceService.getHotlines(region);
    }
}
