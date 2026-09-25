/**
 * Lista de requisitos de contrasena en vivo (ver password-checklist.ftl).
 * Marca cada <li data-rule> como cumplido mientras se escribe. Las reglas
 * replican las de password-policy.js de Keycloak para que el front y el
 * servidor evaluen igual; la validacion real la sigue haciendo el servidor.
 */
const count = (value, test) => value.split('').filter(test).length;

const RULES = {
  length: (value, min) => value.length >= min,
  upperCase: (value, min) =>
    count(value, (ch) => ch === ch.toUpperCase() && ch !== ch.toLowerCase()) >= min,
  lowerCase: (value, min) =>
    count(value, (ch) => ch === ch.toLowerCase() && ch !== ch.toUpperCase()) >= min,
  digits: (value, min) => count(value, (ch) => /\d/.test(ch)) >= min,
  specialChars: (value, min) => count(value, (ch) => /\W/.test(ch)) >= min,
};

for (const list of document.querySelectorAll('[data-password-checklist]')) {
  const input = document.getElementById(list.dataset.passwordChecklist);
  if (!input) {
    continue;
  }

  const items = Array.from(list.querySelectorAll('[data-rule]'));
  const labelMet = list.dataset.labelMet ?? '';
  const labelPending = list.dataset.labelPending ?? '';

  const update = () => {
    for (const item of items) {
      const rule = RULES[item.dataset.rule];
      const met = rule ? rule(input.value, Number(item.dataset.value)) : false;
      item.classList.toggle('is-met', met);
      const status = item.querySelector('[data-status]');
      if (status) {
        status.textContent = met ? labelMet : labelPending;
      }
    }
  };

  input.addEventListener('input', update);
  update();
}
