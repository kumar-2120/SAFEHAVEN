package com.safehaven.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * A crisis hotline or support resource record.
 */
@Entity
@Table(name = "hotlines")
public class Hotline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Display name of the organisation. */
    private String name;

    /** Phone number or contact string. */
    private String number;

    /** Brief description / availability info. */
    private String description;

    /** Country / region (e.g. "USA", "UK", "International"). */
    private String region;

    /** Icon / emoji displayed alongside the card. */
    private String icon;

    public Hotline() {}

    public Hotline(String name, String number, String description, String region, String icon) {
        this.name = name;
        this.number = number;
        this.description = description;
        this.region = region;
        this.icon = icon;
    }

    // ── Getters & Setters ──────────────────────────────────────────────────

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
