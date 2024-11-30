import React, { useState } from "react";
import { calcularNutricion } from "../services/api"; // Importar la función API
import "./Simulacion.css";

const Simulacion = () => {
  const [formData, setFormData] = useState({
    genero: "",
    peso: "",
    talla: "",
    edad: "",
    dias_tratamiento: "",
    factor_estres: "",
  });
  const [datos, setDatos] = useState([]);
  const [tamanoCuerpo, setTamanoCuerpo] = useState(100);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const [resumenTotal, setResumenTotal] = useState(null);

  const calcularResultados = async () => {
    try {
      setError(null); // Limpiar errores previos
  
      // Convertir valores numéricos antes de enviar
      const dataToSend = {
        ...formData,
        peso: parseFloat(formData.peso),
        talla: parseFloat(formData.talla),
        edad: parseInt(formData.edad, 10),
        dias_tratamiento: parseInt(formData.dias_tratamiento, 10),
        factor_estres: parseFloat(formData.factor_estres),
      };
  
      console.log("Datos enviados:", dataToSend); // Verificar datos transformados
  
      const response = await calcularNutricion(dataToSend); // Enviar datos al backend
      setDatos(response.resultadosPorDia); // Guardar los resultados diarios
      setResumenTotal(response.resumenTotal); // Guardar resumen total
  
      const totalCalorias = response.resultadosPorDia.reduce(
        (total, item) => total + parseFloat(item.caloriasDia),
        0
      );
      setTamanoCuerpo(Math.max(50, Math.min(totalCalorias / 50, 200)));
    } catch (err) {
      setError(err.error || "Ocurrió un error al calcular.");
    }
  };
      
    

  return (
    <div className="simulacion-container">
      <div className="datos-paciente">
        <h2>Datos del paciente</h2>
        <label>Edad:</label>
        <input
          type="number"
          name="edad"
          value={(formData.edad)}
          onChange={handleChange}
          placeholder="Edad"
        />

        <label>Peso (kg):</label>
        <input
          type="number"
          name="peso"
          value={(formData.peso)}
          onChange={handleChange}
          placeholder="Peso"
        />

        <label>Estatura (m):</label>
        <input
          type="number"
          name="talla"
          value={(formData.talla)}
          onChange={handleChange}
          placeholder="Estatura"
        />

        <label className="genero-container">Género:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="genero"
              value="Femenino"
              checked={formData.genero === "Femenino"}
              onChange={handleChange}
            />{" "}
            Femenino
          </label>
          <label>
            <input
              type="radio"
              name="genero"
              value="Masculino"
              checked={formData.genero === "Masculino"}
              onChange={handleChange}
            />{" "}
            Masculino
          </label>
        </div>

        <label>Días de alimentación enteral:</label>
        <input
          type="number"
          name="dias_tratamiento"
          value={(formData.dias_tratamiento)}
          onChange={handleChange}
          min="1"
          max="30"
          step="1"
          placeholder="Días"
        />

        <label>Factor de estrés:</label>
        <select
          name="factor_estres"
          value={(formData.factor_estres)}
          onChange={handleChange}
        >
          <option value="1.2">Bajo</option>
          <option value="1.5">Moderado</option>
          <option value="1.7">Alto</option>
        </select>

        <button onClick={calcularResultados}>Calcular</button>
      </div>

      <div className="resultados">
        {error && <p className="error">{error}</p>}
        {/* Representación del cuerpo */}
        <div className="icono-cuerpo">
          <svg
            width="200"
            height="400"
            viewBox="0 0 200 400"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cabeza */}
            <circle cx="100" cy="50" r="30" fill="#f4a261" />
            {/* Torso dinámico */}
            <rect
              x={100 - tamanoCuerpo / 2}
              y="80"
              width={tamanoCuerpo}
              height="150"
              fill="#f4a261"
            />
            {/* Piernas */}
            <rect x="70" y="230" width="20" height="120" fill="#f4a261" />
            <rect x="110" y="230" width="20" height="120" fill="#f4a261" />
            {/* Brazos */}
            <rect
              x={100 - tamanoCuerpo / 2 - 20}
              y="100"
              width="20"
              height="80"
              fill="#f4a261"
            />
            <rect
              x={100 + tamanoCuerpo / 2}
              y="100"
              width="20"
              height="80"
              fill="#f4a261"
            />
          </svg>
        </div>

        <div className="resultados">
  {error && <p className="error">{error}</p>}

          <table>
            <thead>
              <tr>
                <th>Día</th>
                <th>Calorías (Kcal)</th>
                <th>Suplemento (g)</th>
                <th>Preparaciones</th>
                <th>Intervalo</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((dato, index) => (
                <tr key={index}>
                  <td>{dato.dia}</td>
                  <td>{dato.caloriasDia}</td>
                  <td>{dato.suplementoGramos}</td>
                  <td>{dato.preparaciones}</td>
                  <td>
                    {dato.intervaloPreparaciones.horas}h{" "}
                    {dato.intervaloPreparaciones.minutos}m
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {resumenTotal && (
            <div className="resumen-total">
              <h3>Resumen Total:</h3>
              <div>
                <label>Gramos Totales: </label>
                {resumenTotal.gramosTotales}
              </div>
              <div>
                <label>Latas 800g: </label>
                {resumenTotal.latas800g}
              </div>
              <div>
                <label>Latas 400g: </label>
                {resumenTotal.latas400g}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulacion;