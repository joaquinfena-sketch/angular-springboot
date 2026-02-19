package com.joaquin.proyecto_backend.domain;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "accident")
public class Accident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60)
    private String province;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    private LocalDate date;

    public Accident() {}

    public Accident(String province, Double lat, Double lng, LocalDate date) {
        this.province = province;
        this.lat = lat;
        this.lng = lng;
        this.date = date;
    }

    public Long getId() { return id; }
    public String getProvince() { return province; }
    public Double getLat() { return lat; }
    public Double getLng() { return lng; }
    public LocalDate getDate() { return date; }

    public void setId(Long id) { this.id = id; }
    public void setProvince(String province) { this.province = province; }
    public void setLat(Double lat) { this.lat = lat; }
    public void setLng(Double lng) { this.lng = lng; }
    public void setDate(LocalDate date) { this.date = date; }
}
