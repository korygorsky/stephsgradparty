-- Optional: seed sample content so the first-load view feels alive.
-- Skip if you'd rather start with an empty site.

insert into guestbook_entries (name, message, rotation, accent) values
  ('Mom', 'Watching you finish this has been one of the proudest moments of my life. Love you always.', -1.5, true),
  ('Jen', 'from study buddy to actual RMT — you make it look easy (i know it wasn''t)', 2.0, false),
  ('Marcus', 'dibs on the first free massage 💆', -0.8, false);

insert into songs (title, artist, requested_by) values
  ('September', 'Earth, Wind & Fire', 'Jen'),
  ('Landslide', 'Fleetwood Mac', 'Mom'),
  ('Dancing Queen', 'ABBA', 'Marcus');
