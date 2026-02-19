package com.joaquin.proyecto_backend.api;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.joaquin.proyecto_backend.api.dto.AccidentPointDto;
import com.joaquin.proyecto_backend.repo.AccidentQueryRepository;

@RestController
@RequestMapping("/api/accidents")
@CrossOrigin(origins = "http://localhost:4200")
public class AccidentController {

    private final AccidentQueryRepository repo;

    public AccidentController(AccidentQueryRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<AccidentPointDto> list(@RequestParam(required = false) List<String> provinces) {
        if (provinces == null || provinces.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "provinces no puede estar vacío");
        }

        return repo.findAccidents2025ByProvinces(provinces);
    }
}
