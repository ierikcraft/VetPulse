import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateTriage,
  evaluateToxin,
  estimateCost,
} from '../src/data/clinicalData.js';
import { escapeHtml } from '../src/state/store.js';

test('evaluateTriage flags red flags as emergency', () => {
  const res = evaluateTriage({
    species: 'dog',
    ageGroup: 'adult',
    selectedSymptoms: ['vomit_once'],
    redFlags: ['rf_gums'],
    durationHours: 2,
    intensity: 'mild',
  });
  assert.equal(res.level, 'emergency');
});

test('evaluateTriage flags critical symptoms as emergency', () => {
  const res = evaluateTriage({
    species: 'cat',
    ageGroup: 'adult',
    selectedSymptoms: ['open_mouth_cat'],
    redFlags: [],
    durationHours: 1,
    intensity: 'moderate',
  });
  assert.equal(res.level, 'emergency');
});

test('evaluateTriage escalates cat >24h no_appetite to vet24h', () => {
  const res = evaluateTriage({
    species: 'cat',
    ageGroup: 'adult',
    selectedSymptoms: ['no_appetite'],
    redFlags: [],
    durationHours: 24,
    intensity: 'mild',
  });
  assert.equal(res.level, 'vet24h');
});

test('evaluateTriage returns monitor for mild isolated symptom', () => {
  const res = evaluateTriage({
    species: 'dog',
    ageGroup: 'adult',
    selectedSymptoms: ['sneezing'],
    redFlags: [],
    durationHours: 2,
    intensity: 'mild',
  });
  assert.equal(res.level, 'monitor');
});

test('evaluateToxin calculates dark chocolate theobromine dose accurately', () => {
  // 50g dark chocolate (14 mg/g = 700 mg) for a 10 kg dog = 70 mg/kg -> critical (>= 40)
  const res = evaluateToxin({
    toxinId: 'dark_chocolate',
    species: 'dog',
    weightKg: 10,
    amount: 50,
  });
  assert.equal(res.valid, true);
  assert.equal(res.doseMgKg, 70);
  assert.equal(res.risk, 'critical');
});

test('evaluateToxin treats lilies in cats as critical even at amount 1', () => {
  const res = evaluateToxin({
    toxinId: 'lilies',
    species: 'cat',
    weightKg: 4,
    amount: 1,
  });
  assert.equal(res.valid, true);
  assert.equal(res.risk, 'critical');
});

test('evaluateToxin rejects invalid or zero inputs gracefully', () => {
  assert.equal(evaluateToxin({ toxinId: 'dark_chocolate', species: 'dog', weightKg: 0, amount: 10 }).valid, false);
  assert.equal(evaluateToxin({ toxinId: 'dark_chocolate', species: 'dog', weightKg: 10, amount: -5 }).valid, false);
  assert.equal(evaluateToxin({ toxinId: 'dark_chocolate', species: 'dog', weightKg: 'abc', amount: 10 }).valid, false);
});

test('estimateCost scales properly for emergency and pet size', () => {
  const reg = estimateCost({ regionId: 'ES', clinicType: 'regular', petSize: 'medium', scenarioId: 'consult_blood' });
  const er = estimateCost({ regionId: 'ES', clinicType: 'emergency', petSize: 'large', scenarioId: 'consult_blood' });
  assert.ok(er.totalMin > reg.totalMin);
  assert.ok(er.totalMax > reg.totalMax);
  assert.equal(reg.breakdown.length, 3);
});

test('escapeHtml neutralizes XSS payloads', () => {
  const dirty = `<script>alert("xss")</script>'`;
  const clean = escapeHtml(dirty);
  assert.ok(!clean.includes('<script>'));
  assert.ok(clean.includes('&lt;script&gt;'));
});

import { evaluateVitals, SPECIES_LIST, SPECIES_CARE_GUIDES } from '../src/data/clinicalData.js';
import { MAX_PETS } from '../src/state/store.js';

test('evaluateVitals flags blue/pale gums and high fever as critical', () => {
  const res = evaluateVitals({ species: 'dog', gums: 'blue', tempC: '40.5', rpm: '50' });
  assert.equal(res.maxSeverity, 'critical');
  assert.equal(res.alerts.length, 3);
});

test('evaluateTriage escalates to emergency when vitals show brick-red gums', () => {
  const res = evaluateTriage({
    species: 'dog',
    ageGroup: 'adult',
    selectedSymptoms: [],
    redFlags: [],
    durationHours: 1,
    intensity: 'mild',
    vitals: { gums: 'brick', tempC: '38.5', rpm: '24' },
  });
  assert.equal(res.level, 'emergency');
});

test('evaluateTriage escalates rabbit >12h no_appetite to emergency (GI stasis risk)', () => {
  const res = evaluateTriage({
    species: 'rabbit',
    ageGroup: 'adult',
    selectedSymptoms: ['no_appetite'],
    redFlags: [],
    durationHours: 12,
    intensity: 'mild',
  });
  assert.equal(res.level, 'emergency');
});

test('evaluateTriage handles bird tail bobbing and rodent wet tail as emergency', () => {
  assert.equal(
    evaluateTriage({ species: 'bird', selectedSymptoms: ['bird_tail_bob'] }).level,
    'emergency'
  );
  assert.equal(
    evaluateTriage({ species: 'rodent', selectedSymptoms: ['rodent_wet_tail'] }).level,
    'emergency'
  );
  assert.equal(
    evaluateTriage({ species: 'bird', selectedSymptoms: ['lethargy'] }).level,
    'vet24h'
  );
  assert.equal(
    evaluateTriage({ species: 'reptile', selectedSymptoms: ['reptile_soft_shell'] }).level,
    'vet24h'
  );
});

test('MAX_PETS is 5 and all 6 species have care guides', () => {
  assert.equal(MAX_PETS, 5);
  assert.equal(SPECIES_LIST.length, 6);
  for (const sp of SPECIES_LIST) {
    assert.ok(SPECIES_CARE_GUIDES[sp.id], `Missing care guide for ${sp.id}`);
    assert.ok(SPECIES_CARE_GUIDES[sp.id].conditions.length >= 2);
  }
});

test('evaluateVitals uses species-specific normal ranges for rabbit, bird, and reptile', () => {
  assert.equal(evaluateVitals({ species: 'rabbit', gums: 'pink', tempC: '39.6', rpm: '48' }).maxSeverity, 'normal');
  assert.equal(evaluateVitals({ species: 'bird', gums: 'pink', tempC: '41.0', rpm: '50' }).maxSeverity, 'normal');
  assert.equal(evaluateVitals({ species: 'reptile', gums: 'pink', tempC: '28.0', rpm: '8' }).maxSeverity, 'normal');
  assert.equal(evaluateVitals({ species: 'reptile', gums: 'pink', tempC: '28.0', rpm: '22' }).maxSeverity, 'high');
});
