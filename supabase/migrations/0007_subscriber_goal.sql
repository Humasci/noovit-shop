-- The newsletter pop-up asks for the visitor's main goal before the email (quiz goal ids: sleep, brain, gut …),
-- so welcome flows and campaigns can be segmented by goal.
alter table subscribers add column if not exists goal text check (goal is null or char_length(goal) <= 40);
create index if not exists subscribers_goal_idx on subscribers (goal) where goal is not null;
