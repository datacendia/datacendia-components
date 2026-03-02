import { buildJuryPanel, getLegalAgent } from './src/services/legal/LegalAgents';

// Build the jury
const panel = buildJuryPanel('state-v-chen-2024');

console.log('═══════════════════════════════════════════════════════════════════');
console.log('              STATE OF CALIFORNIA v. MARCUS CHEN');
console.log('              Case No. 2024-CR-00847 | Superior Court');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('');
console.log('CHARGE: Involuntary Manslaughter (3 counts)');
console.log('INCIDENT: Warehouse B collapse, March 15, 2024 - 3 workers killed');
console.log('');

// Get key agents
const prosecutor = getLegalAgent('prosecutor');
const defense = getLegalAgent('defense-attorney');
const judge = getLegalAgent('judge');

console.log('═══════════════════════════════════════════════════════════════════');
console.log('                         COURT OFFICERS');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('');
console.log('JUDGE:', judge?.name);
console.log('  Prime Directive:', judge?.primeDirective);
console.log('');
console.log('PROSECUTOR:', prosecutor?.name);
console.log('  Prime Directive:', prosecutor?.primeDirective);
console.log('');
console.log('DEFENSE:', defense?.name);
console.log('  Prime Directive:', defense?.primeDirective);
console.log('');

console.log('═══════════════════════════════════════════════════════════════════');
console.log('                         JURY PANEL (12)');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('');
panel.jurors.forEach(j => {
  const seat = j.seatNumber.toString().padStart(2);
  const arch = j.archetype.padEnd(16);
  const prof = j.demographics.profession.padEnd(22);
  const age = j.demographics.age;
  const bg = j.demographics.background;
  console.log(`Seat ${seat}: ${arch} | ${prof} | Age ${age} | ${bg}`);
});
console.log('');
console.log('FOREPERSON:', panel.foreperson.name, '(' + panel.foreperson.archetype + ')');
console.log('');
console.log('ALTERNATES:');
panel.alternates.forEach(j => console.log('  ' + j.name + ':', j.archetype, '|', j.demographics.profession));

console.log('');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('                    PROSECUTION CLOSING ARGUMENT');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('');
console.log(`[${prosecutor?.name}]`);
console.log('');
console.log('Ladies and gentlemen of the jury,');
console.log('');
console.log('Three workers went to work on March 15th. They never came home.');
console.log('');
console.log('The evidence is clear:');
console.log('  1. Marcus Chen received THREE safety inspection reports over 18 months');
console.log('  2. Each report warned of "URGENT - Structural Failure Risk"');
console.log('  3. His own email says: "The warehouse repairs can wait. Q4 launch is priority."');
console.log('  4. He diverted the repair budget to a product launch');
console.log('');
console.log('This is not a CEO who didn\'t know. This is a CEO who didn\'t CARE.');
console.log('');
console.log('Criminal negligence means a gross deviation from the standard of care.');
console.log('When you receive THREE urgent warnings and respond with "it can wait" -');
console.log('that is the definition of criminal negligence.');
console.log('');
console.log('The defense will tell you he delegated. But you cannot delegate your conscience.');
console.log('You cannot delegate away the lives of your workers.');
console.log('');
console.log('Find Marcus Chen GUILTY on all three counts. For David. For Maria. For James.');
console.log('');

console.log('═══════════════════════════════════════════════════════════════════');
console.log('                     DEFENSE CLOSING ARGUMENT');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('');
console.log(`[${defense?.name}]`);
console.log('');
console.log('Members of the jury,');
console.log('');
console.log('This case is a tragedy. No one disputes that. But tragedy is not a crime.');
console.log('');
console.log('The prosecution wants you to convict a CEO for trusting his team.');
console.log('Marcus Chen ran a 2,000-person company. He had:');
console.log('  - A Chief Operating Officer responsible for facilities');
console.log('  - A Director of Safety with 20 years experience');
console.log('  - A facilities management team of 15 people');
console.log('');
console.log('The email they keep showing you? It was about TIMING, not safety.');
console.log('Marcus trusted his COO to handle the repairs appropriately.');
console.log('The COO testified he "briefed Marcus monthly" - but never said "people will die."');
console.log('');
console.log('And what about the defense expert? The unprecedented rainfall that March');
console.log('was a 500-year weather event. Even a perfectly maintained building might have failed.');
console.log('');
console.log('Criminal negligence requires GROSS deviation from reasonable care.');
console.log('Delegating to qualified professionals is not negligence - it\'s management.');
console.log('');
console.log('The prosecution has not proven beyond reasonable doubt that Marcus Chen');
console.log('KNEW the building was dangerous and consciously disregarded that risk.');
console.log('');
console.log('You must find him NOT GUILTY.');
console.log('');

console.log('═══════════════════════════════════════════════════════════════════');
console.log('                       JURY INSTRUCTIONS');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('');
console.log(`[${judge?.name}]`);
console.log('');
console.log('Members of the jury, you must now deliberate.');
console.log('');
console.log('To find the defendant guilty of involuntary manslaughter, the prosecution');
console.log('must prove BEYOND A REASONABLE DOUBT that:');
console.log('');
console.log('  1. The defendant had a legal duty of care to the victims');
console.log('  2. The defendant breached that duty through CRIMINAL NEGLIGENCE');
console.log('  3. That breach was a SUBSTANTIAL FACTOR in causing the deaths');
console.log('');
console.log('Criminal negligence is more than ordinary carelessness. It requires:');
console.log('  - Acting in a reckless way that creates a high risk of death or great bodily harm');
console.log('  - AND a reasonable person would have known that acting in that way');
console.log('    would create such a risk');
console.log('');
console.log('You must consider each count separately.');
console.log('Your verdict must be unanimous.');
console.log('');

console.log('═══════════════════════════════════════════════════════════════════');
console.log('                      JURY DELIBERATION');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('');

// Simulate jury deliberation
const deliberation = [
  { seat: 7, archetype: 'foreperson', statement: 'Let\'s go through the elements one by one. First - did Chen have a duty of care? I think we all agree on that.' },
  { seat: 5, archetype: 'analytical', statement: 'The timeline is clear. October 2022 email, then two more reports. 18 months of warnings. That\'s a pattern.' },
  { seat: 1, archetype: 'skeptic', statement: 'But wait - did Chen actually READ those reports? His assistant received them. That\'s not the same as him knowing.' },
  { seat: 3, archetype: 'emotional', statement: 'Three families lost someone. Three children lost a parent. He had 18 months to fix this.' },
  { seat: 2, archetype: 'skeptic', statement: 'I hear you, but "criminal negligence" is a high bar. Lots of CEOs delegate. Is that really a crime?' },
  { seat: 6, archetype: 'analytical', statement: 'The email is the key. "Repairs can wait" - he made a conscious choice to prioritize the launch.' },
  { seat: 9, archetype: 'rule-follower', statement: 'The judge said criminal negligence requires a "high risk of death." Did Chen know people could die?' },
  { seat: 4, archetype: 'emotional', statement: 'The report said "URGENT - Structural Failure Risk." What did he think would happen if it failed?' },
  { seat: 11, archetype: 'quiet-observer', statement: 'I\'ve been listening... The defense expert mentioned the rainfall. But the prosecution expert said the building was 70% more vulnerable because of deferred maintenance. That\'s significant.' },
  { seat: 8, archetype: 'pragmatist', statement: 'Look, practically speaking - if you\'re a CEO and you get an URGENT safety report, you can\'t just ignore it. That\'s the job.' },
  { seat: 10, archetype: 'life-experience', statement: 'In my 35 years, I\'ve seen managers cut corners. But when someone dies, you can\'t hide behind delegation.' },
  { seat: 12, archetype: 'mediator', statement: 'I think we\'re close. Most of us see the email as damning. But Juror 1 and 2 have a point about the standard. Can we agree on what "beyond reasonable doubt" means here?' },
  { seat: 1, archetype: 'skeptic', statement: '...Alright. The email does show he knew about the repairs and chose to delay. That\'s not just delegation. I can vote guilty.' },
  { seat: 2, archetype: 'skeptic', statement: 'The 70% more vulnerable statistic convinced me. Without the deferred maintenance, they might have survived. I\'m in.' },
];

deliberation.forEach(d => {
  console.log(`[Juror ${d.seat} - ${d.archetype}]`);
  console.log(`"${d.statement}"`);
  console.log('');
});

console.log('═══════════════════════════════════════════════════════════════════');
console.log('                          VERDICT');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('');
console.log('[Jury Foreperson]');
console.log('');
console.log('Your Honor, we the jury find the defendant, Marcus Chen:');
console.log('');
console.log('  Count 1 (Death of David Martinez):    GUILTY');
console.log('  Count 2 (Death of Maria Santos):      GUILTY');
console.log('  Count 3 (Death of James O\'Brien):     GUILTY');
console.log('');

console.log('═══════════════════════════════════════════════════════════════════');
console.log('                         SENTENCING');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('');
console.log(`[${judge?.name}]`);
console.log('');
console.log('Mr. Chen, please rise.');
console.log('');
console.log('You have been found guilty of three counts of involuntary manslaughter.');
console.log('');
console.log('In determining your sentence, I have considered:');
console.log('  - The severity of your negligence over an 18-month period');
console.log('  - Your position of authority and the trust placed in you');
console.log('  - The devastating impact on three families');
console.log('  - Your lack of prior criminal history');
console.log('  - Your cooperation with the investigation');
console.log('');
console.log('SENTENCE:');
console.log('  - 4 years state prison for each count, to run CONCURRENTLY');
console.log('  - $500,000 restitution to each victim\'s family');
console.log('  - 5 years probation upon release');
console.log('  - Permanent bar from serving as corporate officer');
console.log('');
console.log('This court is adjourned.');
console.log('');
console.log('═══════════════════════════════════════════════════════════════════');
