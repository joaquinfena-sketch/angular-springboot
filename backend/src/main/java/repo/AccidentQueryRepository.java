package com.joaquin.proyecto_backend.repo;

import com.joaquin.proyecto_backend.api.dto.AccidentPointDto;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public class AccidentQueryRepository {

    private final JdbcClient jdbc;

    public AccidentQueryRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public List<AccidentPointDto> findAccidents2025ByProvinces(List<String> provinces) {

        LocalDateTime from = LocalDateTime.of(2025, 1, 1, 0, 0);
        LocalDateTime to   = LocalDateTime.of(2026, 1, 1, 0, 0);

        String sql = """
            select distinct on (a.id_accidente)
                a.id_accidente as id,
                p.descripcion  as province,
                vll.latitud    as lat,
                vll.longitud   as lng
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
                .query(AccidentPointDto.class)
                .list();
    }
}
