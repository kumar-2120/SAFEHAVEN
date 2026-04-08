package com.safehaven.service;

import com.safehaven.model.Hotline;
import com.safehaven.repository.HotlineRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final HotlineRepository hotlineRepository;

    public ResourceService(HotlineRepository hotlineRepository) {
        this.hotlineRepository = hotlineRepository;
    }

    /**
     * Returns all hotlines, optionally filtered by region.
     *
     * @param region optional region filter; returns all when null or blank
     */
    public List<Hotline> getHotlines(String region) {
        if (region == null || region.isBlank()) {
            return hotlineRepository.findAll();
        }
        return hotlineRepository.findByRegionIgnoreCase(region);
    }

    /**
     * Pre-populates the database with well-known crisis hotlines on first start.
     */
    @PostConstruct
    public void seedHotlines() {
        if (hotlineRepository.count() > 0) {
            return;
        }
        hotlineRepository.saveAll(List.of(
            new Hotline(
                "National DV Hotline (USA)",
                "1-800-799-7233",
                "Call or text START to 88788 • TTY: 1-800-787-3224 • Available 24/7",
                "USA",
                "📞"
            ),
            new Hotline(
                "Crisis Text Line (USA)",
                "Text HOME to 741741",
                "Free, confidential 24/7 crisis counselling via text",
                "USA",
                "💬"
            ),
            new Hotline(
                "National DV Helpline (UK)",
                "0808 2000 247",
                "National Domestic Violence Helpline • Free & confidential 24/7",
                "UK",
                "🌐"
            ),
            new Hotline(
                "Refuge (UK)",
                "0808 2000 247",
                "Support for women and children fleeing domestic violence",
                "UK",
                "🏠"
            ),
            new Hotline(
                "International Directory",
                "hotpeachpages.net",
                "Global directory of domestic violence agencies & hotlines",
                "International",
                "🌍"
            ),
            new Hotline(
                "Emergency Services",
                "911 / 999 / 112",
                "If you or someone else is in immediate danger, call emergency services",
                "International",
                "🆘"
            )
        ));
    }
}
