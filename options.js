    // Saves options to chrome.storage
   function saveOptions() {
       var projectToken = document.getElementById('project_token').value;
       chrome.storage.sync.set({
           projectToken: projectToken
       }, function() {
           // Update status to let user know options were saved.
           var status = document.getElementById('status');
           status.textContent = 'Options saved.';
           setTimeout(function() {
               status.textContent = '';
           }, 750);
       });
   }

   function restoreOptions() {
       document.getElementById('project_token').value = '';
   }

   function setOptions() {
       chrome.storage.sync.get({
           projectToken: '',
       }, function(items) {
           document.getElementById('project_token').value = items.projectToken;
       });
   }
   document.addEventListener('DOMContentLoaded', setOptions);
   document.getElementById('save').addEventListener('click', saveOptions);
   document.getElementById('reset').addEventListener('click', restoreOptions);
