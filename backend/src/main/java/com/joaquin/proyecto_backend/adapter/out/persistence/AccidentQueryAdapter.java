package com.joaquin.proyecto_backend.adapter.out.persistence;

import com.joaquin.proyecto_backend.application.port.out.GetAccidentPointsPort;
import com.joaquin.proyecto_backend.application.port.out.GetAccidentReportsPort;
import com.joaquin.proyecto_backend.domain.AccidentPoint;
import com.joaquin.proyecto_backend.domain.AccidentReport;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Adaptador de salida: persistencia (JDBC).
 * Implementa los puertos de obtención de accidentes.
 */
@Component
public class AccidentQueryAdapter implements GetAccidentPointsPort, GetAccidentReportsPort {

    private final JdbcClient jdbc;

    public AccidentQueryAdapter(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<AccidentPoint> findByProvinces(List<String> provinces) {
        LocalDateTime from = LocalDateTime.of(2025, 1, 1, 0, 0);
        LocalDateTime to = LocalDateTime.of(2026, 1, 1, 0, 0);

        String sql = """
            select distinct on (a.id_accidente)
                a.id_accidente as id,
                p.descripcion  as province,
                vll.latitud    as lat,
                vll.longitud   as lng,
                ''             as name
            from arena2.accidente a
            join arena2.region r
              on r.id_accidente = a.id_accidente
            join arena2.provincias p
              on p.id_provincia = r.cod_provincia
            join arena2.carretera c
              on c.id_accidente = a.id_accidente
            join arena2.via_carretera vc
              on vc.matricula = c.carretera_desc
            join arena2.via_lat_lng vll
              on vll.id_via = vc.id_via
            where a.fecha_hora_accidente >= :from
              and a.fecha_hora_accidente <  :to
              and p.descripcion in (:provinces)
              and vll.latitud  is not null
              and vll.longitud is not null
            order by a.id_accidente, vll.pk desc
            """;

        return jdbc.sql(sql)
                .param("from", from)
                .param("to", to)
                .param("provinces", provinces)
                .query(AccidentPoint.class)
                .list();
    }

    @Override
    public List<AccidentReport> findByProvinceAndDateRange(String province, LocalDate from, LocalDate to) {
        String sql = """
            select
                id     as id,
                province,
                lat,
                lng,
                date
            from accident
            where province = :province
              and date >= :from
              and date <= :to
            order by date, id
            """;

        return jdbc.sql(sql)
                .param("province", province)
                .param("from", from)
                .param("to", to)
                .query(AccidentReport.class)
                .list();
    }
}
