import { useState, useEffect } from 'react';
import './SolSelector.css';

/**
 * Componente para seleccionar el sol marciano mediante controles numéricos
 * @param {Object} props - Propiedades del componente
 * @param {number} props.initialSol - Sol inicial seleccionado
 * @param {number} props.maxSol - Sol máximo disponible para el rover seleccionado
 * @param {Function} props.onSolChange - Función que se ejecuta al cambiar el sol
 * @returns {JSX.Element} - Componente SolSelector
 */
const SolSelector = ({ initialSol = 0, maxSol = 1000, onSolChange }) => {
  const [sol, setSol] = useState(initialSol);
  const [displayValue, setDisplayValue] = useState(sol);
  
  // Actualizar el sol cuando cambia el sol inicial o el sol máximo
  useEffect(() => {
    // Si el sol inicial es mayor que el sol máximo, usar el sol máximo
    if (initialSol > maxSol) {
      setSol(maxSol);
      setDisplayValue(maxSol);
    } else {
      setSol(initialSol);
      setDisplayValue(initialSol);
    }
  }, [initialSol, maxSol]);
  
  // Cambiar el sol en una cantidad específica
  const changeSolBy = (amount) => {
    let newSol = sol + amount;
    
    // Asegurarse de que el nuevo sol está dentro de los límites
    newSol = Math.max(0, Math.min(newSol, maxSol));
    
    setSol(newSol);
    setDisplayValue(newSol);
    onSolChange(newSol);
  };
  
  // Ir a un sol específico (porcentaje del máximo)
  const goToSolPercent = (percent) => {
    const newSol = Math.round(maxSol * (percent / 100));
    setSol(newSol);
    setDisplayValue(newSol);
    onSolChange(newSol);
  };
  
  const handleInputChange = (e) => {
    // Solo permitir números
    const value = e.target.value.replace(/[^0-9]/g, '');
    setDisplayValue(value === '' ? '' : parseInt(value, 10));
  };
  
  const handleInputBlur = () => {
    let newSol = displayValue;
    
    // Si está vacío, volver al sol anterior
    if (newSol === '' || isNaN(newSol)) {
      setDisplayValue(sol);
      return;
    }
    
    // Asegurarse de que esté dentro de los límites
    newSol = Math.max(0, Math.min(newSol, maxSol));
    
    setSol(newSol);
    setDisplayValue(newSol);
    onSolChange(newSol);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    handleInputBlur();
  };
  
  return (
    <div className="sol-selector">
      <div className="sol-label">
        Sol Marciano (Día en Marte):
      </div>
      
      <div className="sol-quick-buttons">
        <button 
          type="button" 
          onClick={() => goToSolPercent(0)}
          className="sol-btn sol-btn-quick"
        >
          Inicio (0)
        </button>
        <button 
          type="button" 
          onClick={() => goToSolPercent(25)}
          className="sol-btn sol-btn-quick"
        >
          25%
        </button>
        <button 
          type="button" 
          onClick={() => goToSolPercent(50)}
          className="sol-btn sol-btn-quick"
        >
          50%
        </button>
        <button 
          type="button" 
          onClick={() => goToSolPercent(75)}
          className="sol-btn sol-btn-quick"
        >
          75%
        </button>
        <button 
          type="button" 
          onClick={() => goToSolPercent(100)}
          className="sol-btn sol-btn-quick"
        >
          Final ({maxSol})
        </button>
      </div>
      
      <div className="sol-controls">
        <div className="sol-step-buttons">
          <button 
            type="button" 
            onClick={() => changeSolBy(-100)}
            className="sol-btn sol-btn-step"
            disabled={sol <= 0}
          >
            -100
          </button>
          <button 
            type="button" 
            onClick={() => changeSolBy(-10)}
            className="sol-btn sol-btn-step"
            disabled={sol <= 0}
          >
            -10
          </button>
          <button 
            type="button" 
            onClick={() => changeSolBy(-1)}
            className="sol-btn sol-btn-step"
            disabled={sol <= 0}
          >
            -1
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="sol-input-form">
          <input
            type="text"
            id="sol-input"
            name="sol"
            value={displayValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="sol-input"
            aria-label="Valor del Sol"
          />
          
          <span className="sol-max">
            / {maxSol}
          </span>
        </form>
        
        <div className="sol-step-buttons">
          <button 
            type="button" 
            onClick={() => changeSolBy(1)}
            className="sol-btn sol-btn-step"
            disabled={sol >= maxSol}
          >
            +1
          </button>
          <button 
            type="button" 
            onClick={() => changeSolBy(10)}
            className="sol-btn sol-btn-step"
            disabled={sol >= maxSol}
          >
            +10
          </button>
          <button 
            type="button" 
            onClick={() => changeSolBy(100)}
            className="sol-btn sol-btn-step"
            disabled={sol >= maxSol}
          >
            +100
          </button>
        </div>
      </div>
      
      <div className="sol-info">
        <div className="sol-info-item">
          <span className="sol-info-label">Sol 0:</span>
          <span className="sol-info-value">Primer día del rover en Marte</span>
        </div>
        <div className="sol-info-item">
          <span className="sol-info-label">Sol {maxSol}:</span>
          <span className="sol-info-value">Día más reciente disponible</span>
        </div>
      </div>
    </div>
  );
};

export default SolSelector; 