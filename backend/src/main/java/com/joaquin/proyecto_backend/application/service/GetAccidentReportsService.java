package com.joaquin.proyecto_backend.application.service;

import com.joaquin.proyecto_backend.application.port.in.GetAccidentReportsUseCase;
import com.joaquin.proyecto_backend.application.port.out.GetAccidentReportsPort;
import com.joaquin.proyecto_backend.domain.AccidentReport;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class GetAccidentReportsService implements GetAccidentReportsUseCase {

    private final GetAccidentReportsPort getAccidentReportsPort;

    public GetAccidentReportsService(GetAccidentReportsPort getAccidentReportsPort) {
        this.getAccidentReportsPort = getAccidentReportsPort;
    }

    @Override
    public List<AccidentReport> getByProvinceAndDateRange(String province, LocalDate from, LocalDate to) {
        return getAccidentReportsPort.findByProvinceAndDateRange(province, from, to);
    }
}
