package com.joaquin.proyecto_backend.adapter.in.web;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.joaquin.proyecto_backend.adapter.in.web.dto.AccidentPointDto;
import com.joaquin.proyecto_backend.adapter.in.web.dto.AccidentReportDto;
import com.joaquin.proyecto_backend.application.port.in.GetAccidentPointsUseCase;
import com.joaquin.proyecto_backend.application.port.in.GetAccidentReportsUseCase;
import com.joaquin.proyecto_backend.domain.AccidentPoint;
import com.joaquin.proyecto_backend.domain.AccidentReport;

/**
 * Adaptador de entrada: API REST (controlador).
 * Delega en los casos de uso y mapea dominio → DTO.
 */
@RestController
@RequestMapping("/api/accidents")
@CrossOrigin(origins = {"http://localhost:4200", "https://joaquinfena-sketch.github.io"})
public class AccidentController {

    private static final Logger log = LoggerFactory.getLogger(AccidentController.class);

    private final GetAccidentPointsUseCase getAccidentPointsUseCase;
    private final GetAccidentReportsUseCase getAccidentReportsUseCase;

    public AccidentController(
            GetAccidentPointsUseCase getAccidentPointsUseCase,
            GetAccidentReportsUseCase getAccidentReportsUseCase) {
        this.getAccidentPointsUseCase = getAccidentPointsUseCase;
        this.getAccidentReportsUseCase = getAccidentReportsUseCase;
    }

    @GetMapping
    public List<AccidentPointDto> list(@RequestParam(required = false) List<String> provinces) {
        if (provinces == null || provinces.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "provinces no puede estar vacío");
        }

        List<AccidentPoint> points = getAccidentPointsUseCase.getByProvinces(provinces);
        log.info("GET /api/accidents provincias={} -> {} puntos", provinces, points.size());
        return points.stream()
                .map(p -> new AccidentPointDto(p.id(), p.province(), p.lat(), p.lng(), p.name()))
                .toList();
    }

    @GetMapping("/report")
    public List<AccidentReportDto> report(
            @RequestParam String province,
            @RequestParam("from") LocalDate from,
            @RequestParam("to") LocalDate to
    ) {
        if (province == null || province.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "province es obligatorio");
        }
        if (from == null || to == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "from y to son obligatorios");
        }
        if (to.isBefore(from)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "to debe ser >= from");
        }

        List<AccidentReport> reports = getAccidentReportsUseCase.getByProvinceAndDateRange(province, from, to);
        return reports.stream()
                .map(r -> new AccidentReportDto(r.id(), r.province(), r.lat(), r.lng(), r.date()))
                .toList();
    }
}
