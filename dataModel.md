Cattle
  id            (internal UUID)
  tag           (string, unique, farmer-facing identifier ear tag)
  breed         (string or enum)
  gender        (enum: male/female)
  birth_date    (date)
  status        (enum: active/sold/deceased/removed)
  created_at / updated_at  

HealthEvent  (1-to-many)
  id
  cattle_id     (FK)
  type          (enum: vaccination/treatment/checkup)
  date
  notes         (string, optional)


GET    /cattle              (list, with ?status=&breed=&search= query params)
GET    /cattle/:id
POST   /cattle
PUT    /cattle/:id
DELETE /cattle/:id           (or PATCH /cattle/:id/status)

POST   /cattle/:id/health-events
GET    /cattle/:id/health-events

GET    /analytics            