// The waitlist form posts to the shared forms Worker, which redirects back
// with ?form=sent or ?form=error. Show the matching message.
(function () {
  var state = new URLSearchParams(window.location.search).get('form');
  if (state !== 'sent' && state !== 'error') return;
  if (state === 'sent') document.getElementById('form').classList.add('hidden');
  document.getElementById(state === 'sent' ? 'ok' : 'err').classList.remove('hidden');
  document.getElementById('demo').scrollIntoView();
})();
