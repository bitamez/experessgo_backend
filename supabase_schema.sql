-- Bus Booking System Schema

-- Create tables
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text unique,
  role text default 'user',
  tickets_count int default 0,
  bonus_tickets int default 0,
  preferred_language text default 'am',
  created_at timestamp default now()
);

create table buses (
  bus_id serial primary key,
  bus_name text,
  bus_number text unique,
  total_seats int not null
);

create table seats (
  seat_id serial primary key,
  bus_id int references buses(bus_id) on delete cascade,
  seat_number text,
  unique(bus_id, seat_number)
);

create table routes (
  route_id serial primary key,
  source_en text,
  destination_en text,
  source_am text,
  destination_am text
);

create table schedules (
  schedule_id serial primary key,
  bus_id int references buses(bus_id),
  route_id int references routes(route_id),
  travel_date date,
  departure_time time
);

create table bookings (
  booking_id serial primary key,
  user_id uuid references public.users(id),
  schedule_id int references schedules(schedule_id),
  seat_id int references seats(seat_id),
  is_bonus boolean default false,
  created_at timestamp default now(),
  unique(schedule_id, seat_id)
);

create table payments (
  payment_id serial primary key,
  booking_id int references bookings(booking_id),
  amount numeric,
  payment_method text,
  status text,
  paid_at timestamp
);

-- RLS Policies
alter table users enable row level security;
alter table bookings enable row level security;

create policy "Users can view own data"
on users
for select
using (auth.uid() = id);

create policy "User can view own bookings"
on bookings
for select
using (auth.uid() = user_id);

create policy "User can create booking"
on bookings
for insert
with check (auth.uid() = user_id);

-- Rewards Trigger & Function
create or replace function handle_rewards()
returns trigger as $$
begin
  update users
  set tickets_count = tickets_count + 1
  where id = new.user_id;

  update users
  set bonus_tickets = bonus_tickets + 1
  where id = new.user_id
  and (tickets_count % 10 = 0);

  return new;
end;
$$ language plpgsql;

create trigger reward_trigger
after insert on bookings
for each row
execute function handle_rewards();
