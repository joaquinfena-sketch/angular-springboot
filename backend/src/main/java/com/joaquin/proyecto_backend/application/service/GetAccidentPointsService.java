package com.joaquin.proyecto_backend.application.service;

import com.joaquin.proyecto_backend.application.port.in.GetAccidentPointsUseCase;
import com.joaquin.proyecto_backend.application.port.out.GetAccidentPointsPort;
import com.joaquin.proyecto_backend.domain.AccidentPoint;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetAccidentPointsService implements GetAccidentPointsUseCase {

    private final GetAccidentPointsPort getAccidentPointsPort;

    public GetAccidentPointsService(GetAccidentPointsPort getAccidentPointsPort) {
        this.getAccidentPointsPort = getAccidentPointsPort;
    }

    @Override
    public List<AccidentPoint> getByProvinces(List<String> provinces) {
        return getAccidentPointsPort.findByProvinces(provinces);
    }
}
