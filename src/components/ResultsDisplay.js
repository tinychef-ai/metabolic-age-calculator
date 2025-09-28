import React from 'react';
import './ResultsDisplay.css';

const ResultsDisplay = ({ results, onRestart }) => {
  if (!results) return null;

  const getImpactClass = (impact) => {
    if (impact > 0) return 'negative';
    if (impact < 0) return 'positive';
    return 'neutral';
  };

  const getImpactSign = (impact) => {
    if (impact > 0) return '+';
    if (impact < 0) return '';
    return '';
  };

  const formatAge = (age) => {
    return Math.round(age);
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Your Metabolic Age Results</h2>
      </div>
      
      <div className="metabolic-age-display">
        <div className="metabolic-age-number">
          {formatAge(results.metabolicAge)}
        </div>
        <div className="metabolic-age-label">Metabolic Age</div>
        <div className="metabolic-age-comparison">
          {results.ageDifference > 0 ? (
            <span>+{formatAge(results.ageDifference)} years older than your actual age</span>
          ) : results.ageDifference < 0 ? (
            <span>{formatAge(Math.abs(results.ageDifference))} years younger than your actual age — great job!</span>
          ) : (
            <span>Same as your actual age</span>
          )}
        </div>
      </div>

      <div className="factor-cards">
        <div className={`factor-card ${getImpactClass(results.factors.gut.impact)}`}>
          <div className="factor-header">
            <span className="factor-name">Gut Health</span>
            <span className={`factor-impact ${getImpactClass(results.factors.gut.impact)}`}>
              {getImpactSign(results.factors.gut.impact)}{formatAge(results.factors.gut.impact)} yrs
            </span>
          </div>
          <div className="factor-details">
            Score: {results.factors.gut.score} ({results.factors.gut.band})
          </div>
        </div>

        <div className={`factor-card ${getImpactClass(results.factors.bmi.impact)}`}>
          <div className="factor-header">
            <span className="factor-name">Weight Status</span>
            <span className={`factor-impact ${getImpactClass(results.factors.bmi.impact)}`}>
              {getImpactSign(results.factors.bmi.impact)}{formatAge(results.factors.bmi.impact)} yrs
            </span>
          </div>
          <div className="factor-details">
            BMI: {results.factors.bmi.value} ({results.factors.bmi.category})
          </div>
        </div>

        <div className={`factor-card ${getImpactClass(results.factors.sleep.impact)}`}>
          <div className="factor-header">
            <span className="factor-name">Sleep Quality</span>
            <span className={`factor-impact ${getImpactClass(results.factors.sleep.impact)}`}>
              {getImpactSign(results.factors.sleep.impact)}{formatAge(results.factors.sleep.impact)} yrs
            </span>
          </div>
          <div className="factor-details">
            {results.factors.sleep.label}
          </div>
        </div>

        <div className={`factor-card ${getImpactClass(results.factors.activity.impact)}`}>
          <div className="factor-header">
            <span className="factor-name">Activity Level</span>
            <span className={`factor-impact ${getImpactClass(results.factors.activity.impact)}`}>
              {getImpactSign(results.factors.activity.impact)}{formatAge(results.factors.activity.impact)} yrs
            </span>
          </div>
          <div className="factor-details">
            {results.factors.activity.label}
          </div>
        </div>

        <div className={`factor-card ${getImpactClass(results.factors.stress.impact)}`}>
          <div className="factor-header">
            <span className="factor-name">Stress Level</span>
            <span className={`factor-impact ${getImpactClass(results.factors.stress.impact)}`}>
              {getImpactSign(results.factors.stress.impact)}{formatAge(results.factors.stress.impact)} yrs
            </span>
          </div>
          <div className="factor-details">
            {results.factors.stress.label}
          </div>
        </div>
      </div>

      <div className="waterfall">
        <div className="waterfall-title">Calculation Breakdown</div>
        <div className="waterfall-steps">
          <div className="waterfall-step">
            <span>Your Age</span>
            <span>{formatAge(results.actualAge)}</span>
          </div>
          <div className="waterfall-step">
            <span>Gut Health Impact</span>
            <span>{getImpactSign(results.factors.gut.impact)}{formatAge(results.factors.gut.impact)}</span>
          </div>
          <div className="waterfall-step">
            <span>BMI Impact</span>
            <span>{getImpactSign(results.factors.bmi.impact)}{formatAge(results.factors.bmi.impact)}</span>
          </div>
          <div className="waterfall-step">
            <span>Sleep Impact</span>
            <span>{getImpactSign(results.factors.sleep.impact)}{formatAge(results.factors.sleep.impact)}</span>
          </div>
          <div className="waterfall-step">
            <span>Activity Impact</span>
            <span>{getImpactSign(results.factors.activity.impact)}{formatAge(results.factors.activity.impact)}</span>
          </div>
          <div className="waterfall-step">
            <span>Stress Impact</span>
            <span>{getImpactSign(results.factors.stress.impact)}{formatAge(results.factors.stress.impact)}</span>
          </div>
          <div className="waterfall-step">
            <span>Metabolic Age</span>
            <span>{formatAge(results.metabolicAge)}</span>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={onRestart} className="restart-btn">
          Calculate Again
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
