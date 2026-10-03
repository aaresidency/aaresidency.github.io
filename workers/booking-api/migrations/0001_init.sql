-- Bookings submitted through the website form, plus private admin notes.
CREATE TABLE bookings (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  ref          TEXT NOT NULL,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL DEFAULT '',
  phone        TEXT NOT NULL,
  -- Digits with country code (91 added for bare 10-digit numbers) so phone search is format-agnostic.
  phone_digits TEXT NOT NULL,
  -- ISO dates (YYYY-MM-DD); NULL when the guest did not pick dates.
  arrival      TEXT,
  departure    TEXT,
  room_type    TEXT NOT NULL DEFAULT '',
  adults       INTEGER NOT NULL DEFAULT 1,
  children     INTEGER NOT NULL DEFAULT 0,
  guest_notes  TEXT NOT NULL DEFAULT '',
  status       TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'cancelled')),
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX idx_bookings_arrival ON bookings (arrival);
CREATE INDEX idx_bookings_departure ON bookings (departure);
CREATE INDEX idx_bookings_created ON bookings (created_at);

CREATE TABLE admin_notes (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id   INTEGER NOT NULL REFERENCES bookings (id) ON DELETE CASCADE,
  note         TEXT NOT NULL,
  author_email TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX idx_admin_notes_booking ON admin_notes (booking_id, created_at);
