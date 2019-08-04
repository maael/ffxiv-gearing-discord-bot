-- Up
CREATE TABLE ServerTeam (
  id INTEGER PRIMARY KEY,
  discord_server TEXT,
  name TEXT,
  creator TEXT,
  created_at TEXT,
  modified_at TEXT,
  CONSTRAINT ServerTeam_fk_id FOREIGN KEY (id)
      REFERENCES TeamMember (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE TeamMember (
  id INTEGER PRIMARY KEY,
  server_team_id INTEGER,
  ffxiv_server TEXT,
  ffxiv_character TEXT,
  ffxiv_class TEXT,
  CONSTRAINT TeamMember_fk_server_team_id FOREIGN KEY (server_team_id)
      REFERENCES ServerTeam (id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Down
DROP TABLE TeamMember;
DROP TABLE ServerTeam;