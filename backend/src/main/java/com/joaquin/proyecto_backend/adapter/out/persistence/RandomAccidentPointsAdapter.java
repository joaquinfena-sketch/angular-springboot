package com.joaquin.proyecto_backend.adapter.out.persistence;

import com.joaquin.proyecto_backend.application.port.out.GetAccidentPointsPort;
import com.joaquin.proyecto_backend.domain.AccidentPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Adaptador que devuelve 4 puntos fijos por provincia (Andalucía) con nombre de localidad.
 */
@Component
@Primary
public class RandomAccidentPointsAdapter implements GetAccidentPointsPort {

    private static final Logger log = LoggerFactory.getLogger(RandomAccidentPointsAdapter.class);

    /** 4 puntos (lat, lng, nombre) por provincia */
    private static final Map<String, Object[][]> PROVINCE_POINTS = Map.ofEntries(
            Map.entry("Almería", new Object[][] {
                    { 36.8381, -2.4597, "Almería" }, { 37.0245, -2.3102, "Níjar" },
                    { 36.9738, -2.1124, "Carboneras" }, { 37.1856, -1.8239, "Huércal-Overa" }
            }),
            Map.entry("Cádiz", new Object[][] {
                    { 36.5294, -6.2923, "Cádiz" }, { 36.4628, -5.9271, "Vejer de la Frontera" },
                    { 36.7015, -6.1458, "El Puerto de Santa María" }, { 36.3187, -5.4326, "La Línea de la Concepción" }
            }),
            Map.entry("Córdoba", new Object[][] {
                    { 37.8842, -4.7794, "Córdoba" }, { 38.1127, -4.6421, "Villanueva de Córdoba" },
                    { 37.6729, -5.1098, "Palma del Río" }, { 38.2754, -4.3812, "Cardeña" }
            }),
            Map.entry("Granada", new Object[][] {
                    { 37.1882, -3.6067, "Granada" }, { 36.9835, -3.5438, "Motril" },
                    { 37.3214, -3.2519, "Guadix" }, { 37.0798, -4.0065, "Loja" }
            }),
            Map.entry("Huelva", new Object[][] {
                    { 37.2614, -6.9447, "Huelva" }, { 37.4419, -7.1832, "Ayamonte" },
                    { 37.5748, -6.7531, "Almonte" }, { 37.2075, -7.0259, "Punta Umbría" }
            }),
            Map.entry("Jaén", new Object[][] {
                    { 37.7796, -3.7849, "Jaén" }, { 38.0031, -3.5038, "Úbeda" },
                    { 37.6124, -2.9861, "Cazorla" }, { 38.0927, -2.8534, "La Puerta de Segura" }
            }),
            Map.entry("Málaga", new Object[][] {
                    { 36.7213, -4.4214, "Málaga" }, { 36.8357, -4.8972, "Antequera" },
                    { 36.6079, -4.5423, "Torremolinos" }, { 36.9415, -4.2586, "Archidona" }
            }),
            Map.entry("Sevilla", new Object[][] {
                    { 37.3891, -5.9845, "Sevilla" }, { 37.5148, -5.8652, "La Rinconada" },
                    { 37.2469, -6.0853, "Sanlúcar la Mayor" }, { 37.6754, -5.5617, "Carmona" }
            })
    );

    @Override
    public List<AccidentPoint> findByProvinces(List<String> provinces) {
        if (provinces == null || provinces.isEmpty()) {
            return List.of();
        }
        List<AccidentPoint> result = new ArrayList<>();
        long id = 1;
        for (String province : provinces) {
            Object[][] points = PROVINCE_POINTS.get(province.trim());
            if (points == null) {
                log.warn("Provincia no encontrada: '{}'", province);
                continue;
            }
            for (Object[] row : points) {
                double lat = (Double) row[0];
                double lng = (Double) row[1];
                String name = (String) row[2];
                result.add(new AccidentPoint(id++, province, lat, lng, name));
            }
        }
        log.info("Mapa: devolviendo {} puntos para provincias {}", result.size(), provinces);
        return result;
    }
}
