// @ts-check

/**
 * @param {{ moodOptions: Array<{ value: number, label: string, emotion: string, emoji: string, color: string }> }} params
 * @returns {HTMLElement}
 */
export function createMoodFormSection({ moodOptions }) {
  const section = document.createElement('section');
  section.className = 'mood-form-section';

  const form = document.createElement('form');
  form.className = 'mood-form';
  form.id = 'mood-form';

  const datetimeContainer = document.createElement('div');
  datetimeContainer.className = 'datetime-container';

  const dateLabel = document.createElement('label');
  dateLabel.textContent = 'Date';
  dateLabel.htmlFor = 'mood-date';

  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.id = 'mood-date';
  dateInput.name = 'date';
  dateInput.required = true;

  const timeLabel = document.createElement('label');
  timeLabel.textContent = 'Heure';
  timeLabel.htmlFor = 'mood-time';

  const timeInput = document.createElement('input');
  timeInput.type = 'time';
  timeInput.id = 'mood-time';
  timeInput.name = 'time';
  timeInput.required = true;

  datetimeContainer.appendChild(dateLabel);
  datetimeContainer.appendChild(dateInput);
  datetimeContainer.appendChild(timeLabel);
  datetimeContainer.appendChild(timeInput);

  const moodContainer = document.createElement('div');
  moodContainer.className = 'mood-options-container';

  const moodLabel = document.createElement('label');
  moodLabel.textContent = 'Comment vous sentez-vous ?';
  moodContainer.appendChild(moodLabel);

  const moodOptionsDiv = document.createElement('div');
  moodOptionsDiv.className = 'mood-options';

  moodOptions.forEach(option => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'mood-option';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = `mood-${option.value}`;
    radio.name = 'mood';
    radio.value = String(option.value);
    radio.required = true;

    const label = document.createElement('label');
    label.htmlFor = `mood-${option.value}`;
    label.className = 'mood-option-label';
    label.style.backgroundColor = option.color;

    const emoji = document.createElement('span');
    emoji.className = 'mood-emoji';
    emoji.textContent = option.emoji;

    const textContainer = document.createElement('div');
    textContainer.className = 'mood-text-container';

    const text = document.createElement('span');
    text.className = 'mood-text';
    text.textContent = `${option.value} - ${option.label}`;

    const emotion = document.createElement('span');
    emotion.className = 'mood-emotion';
    emotion.textContent = option.emotion;

    textContainer.appendChild(text);
    textContainer.appendChild(emotion);

    label.appendChild(emoji);
    label.appendChild(textContainer);
    optionDiv.appendChild(radio);
    optionDiv.appendChild(label);
    moodOptionsDiv.appendChild(optionDiv);
  });

  moodContainer.appendChild(moodOptionsDiv);

  form.appendChild(datetimeContainer);
  form.appendChild(moodContainer);
  section.appendChild(form);

  return section;
}

/**
 * @returns {HTMLElement}
 */
export function createNavigationSection() {
  const nav = document.createElement('nav');
  nav.className = 'main-navigation';

  const homeLink = document.createElement('a');
  homeLink.href = '#';
  homeLink.textContent = 'Accueil';
  homeLink.className = 'nav-link active';

  const listLink = document.createElement('a');
  listLink.href = '#';
  listLink.textContent = 'Mes Moods';
  listLink.className = 'nav-link';

  const bilansLink = document.createElement('a');
  bilansLink.href = '#';
  bilansLink.textContent = 'Bilans';
  bilansLink.className = 'nav-link';

  nav.appendChild(homeLink);
  nav.appendChild(listLink);
  nav.appendChild(bilansLink);

  return nav;
}
