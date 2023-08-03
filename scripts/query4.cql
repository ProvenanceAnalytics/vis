USING PERIODIC COMMIT 200
LOAD CSV WITH HEADERS FROM "file:///output.csv" AS row
WITH row.id AS id, row.from AS from, row.to AS to, row.type AS type, row.`annotations_event id` AS event_id, row.`annotations_time` AS time
WHERE from IS NOT NULL AND to IS NOT NULL
MERGE (f:Process {id: from})
MERGE (t:Process {id: to})
MERGE (f)-[r:RELATIONSHIP {type: type, eventId: event_id, time: time}]->(t);



