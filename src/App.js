import React, { useMemo, useState } from 'react';
import './App.css';

const seedUnits = [
  {
    unit_id: 'consentx_capture',
    unit_type: 'AGL_API',
    portfolio_role: 'feeder',
    status: 'active',
    lifecycle_state: 'SCALE',
    margin: 0.61,
    risk_score: 0.18,
    overall_score: 0.82,
    traffic_allocation: 82,
    budget_allocation: 820,
    compute_allocation: 8.2,
    last_evidence_at: '2026-04-24T09:10:00Z'
  },
  {
    unit_id: 'own_your_ai_advisor',
    unit_type: 'AGL_AGENT',
    portfolio_role: 'anchor',
    status: 'active',
    lifecycle_state: 'ACTIVE',
    margin: 0.34,
    risk_score: 0.24,
    overall_score: 0.63,
    traffic_allocation: 63,
    budget_allocation: 630,
    compute_allocation: 6.3,
    last_evidence_at: '2026-04-24T08:44:00Z'
  },
  {
    unit_id: 'lifegraph_wallet_bridge',
    unit_type: 'AGL_PIPE',
    portfolio_role: 'backend',
    status: 'recovery',
    lifecycle_state: 'AT_RISK',
    margin: 0.08,
    risk_score: 0.41,
    overall_score: 0.29,
    traffic_allocation: 0,
    budget_allocation: 0,
    compute_allocation: 1.2,
    last_evidence_at: '2026-04-23T23:05:00Z'
  },
  {
    unit_id: 'legacy_demo_surface',
    unit_type: 'AGL_EMBED',
    portfolio_role: 'test',
    status: 'archive_candidate',
    lifecycle_state: 'KILL',
    margin: -0.12,
    risk_score: 0.22,
    overall_score: 0.11,
    traffic_allocation: 0,
    budget_allocation: 0,
    compute_allocation: 0,
    last_evidence_at: '2026-04-21T13:15:00Z'
  }
];

const num = (value) => (typeof value === 'number' ? value.toFixed(2) : value);

function App() {
  const [units] = useState(seedUnits);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(seedUnits[0]);

  const filteredUnits = useMemo(() => {
    if (filter === 'all') return units;
    return units.filter((unit) => unit.lifecycle_state === filter);
  }, [units, filter]);

  const portfolio = useMemo(() => {
    const total = units.length;
    const active = units.filter((u) => u.lifecycle_state === 'ACTIVE' || u.lifecycle_state === 'SCALE').length;
    const kill = units.filter((u) => u.lifecycle_state === 'KILL').length;
    const atRisk = units.filter((u) => u.lifecycle_state === 'AT_RISK').length;
    const avgMargin = units.reduce((sum, u) => sum + u.margin, 0) / total;
    const avgScore = units.reduce((sum, u) => sum + u.overall_score, 0) / total;
    return { total, active, kill, atRisk, avgMargin, avgScore };
  }, [units]);

  const killQueue = units.filter((u) => u.lifecycle_state === 'KILL');
  const scaleQueue = units.filter((u) => u.lifecycle_state === 'SCALE');

  return (
    <div className="agl-shell">
      <header className="agl-header">
        <div>
          <div className="eyebrow">T4H / Autonomous Golden Loop</div>
          <h1>Portfolio Control Plane</h1>
          <p>Enforced execution. Proof-linked outcomes. Automatic kill/scale routing.</p>
        </div>
        <div className="badge-cluster">
          <span className="badge">Runtime: Seed Mode</span>
          <span className="badge">State: Control Shell Live</span>
        </div>
      </header>

      <section className="stats-grid">
        <article className="stat-card"><span>Total Units</span><strong>{portfolio.total}</strong></article>
        <article className="stat-card"><span>Healthy / Scaling</span><strong>{portfolio.active}</strong></article>
        <article className="stat-card"><span>At Risk</span><strong>{portfolio.atRisk}</strong></article>
        <article className="stat-card"><span>Kill Queue</span><strong>{portfolio.kill}</strong></article>
        <article className="stat-card"><span>Avg Margin</span><strong>{num(portfolio.avgMargin)}</strong></article>
        <article className="stat-card"><span>Avg Score</span><strong>{num(portfolio.avgScore)}</strong></article>
      </section>

      <section className="panel-grid">
        <div className="panel panel-wide">
          <div className="panel-head">
            <h2>Unit Rank</h2>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="SCALE">Scale</option>
              <option value="ACTIVE">Active</option>
              <option value="AT_RISK">At Risk</option>
              <option value="KILL">Kill</option>
            </select>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Type</th>
                  <th>Role</th>
                  <th>Lifecycle</th>
                  <th>Margin</th>
                  <th>Risk</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits
                  .slice()
                  .sort((a, b) => b.overall_score - a.overall_score)
                  .map((unit) => (
                    <tr key={unit.unit_id} onClick={() => setSelected(unit)} className={selected?.unit_id === unit.unit_id ? 'selected-row' : ''}>
                      <td>{unit.unit_id}</td>
                      <td>{unit.unit_type}</td>
                      <td>{unit.portfolio_role}</td>
                      <td><span className={`state-pill state-${unit.lifecycle_state.toLowerCase()}`}>{unit.lifecycle_state}</span></td>
                      <td>{num(unit.margin)}</td>
                      <td>{num(unit.risk_score)}</td>
                      <td>{num(unit.overall_score)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><h2>Selected Unit</h2></div>
          {selected && (
            <div className="detail-stack">
              <div><label>Unit ID</label><strong>{selected.unit_id}</strong></div>
              <div><label>Type</label><strong>{selected.unit_type}</strong></div>
              <div><label>Role</label><strong>{selected.portfolio_role}</strong></div>
              <div><label>Lifecycle</label><strong>{selected.lifecycle_state}</strong></div>
              <div><label>Status</label><strong>{selected.status}</strong></div>
              <div><label>Margin</label><strong>{num(selected.margin)}</strong></div>
              <div><label>Risk</label><strong>{num(selected.risk_score)}</strong></div>
              <div><label>Overall Score</label><strong>{num(selected.overall_score)}</strong></div>
              <div><label>Last Evidence</label><strong>{selected.last_evidence_at}</strong></div>
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-head"><h2>Scale Queue</h2></div>
          <ul className="queue-list">
            {scaleQueue.map((unit) => (
              <li key={unit.unit_id}>
                <strong>{unit.unit_id}</strong>
                <span>{unit.traffic_allocation}% traffic · {unit.budget_allocation} budget · {unit.compute_allocation} compute</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <div className="panel-head"><h2>Kill Queue</h2></div>
          <ul className="queue-list">
            {killQueue.map((unit) => (
              <li key={unit.unit_id}>
                <strong>{unit.unit_id}</strong>
                <span>Lifecycle {unit.lifecycle_state} · margin {num(unit.margin)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default App;
