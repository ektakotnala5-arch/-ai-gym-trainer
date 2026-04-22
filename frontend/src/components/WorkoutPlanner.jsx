import { useState } from 'react'

const GOALS = [
  { value: 'lose_weight', label: 'Lose Weight', icon: '🔥', color: '#ff6b35' },
  { value: 'build_muscle', label: 'Build Muscle', icon: '💪', color: '#00c853' },
  { value: 'improve_fitness', label: 'Improve Fitness', icon: '⚡', color: '#2196f3' },
  { value: 'maintain', label: 'Maintain', icon: '🎯', color: '#9c27b0' },
]

const LEVELS = [
  { value: 'beginner', label: 'Beginner', icon: '🌱', desc: '0-6 months' },
  { value: 'intermediate', label: 'Intermediate', icon: '⚡', desc: '6-24 months' },
  { value: 'advanced', label: 'Advanced', icon: '🔥', desc: '2+ years' },
]

const EQUIPMENT = [
  { value: 'gym', label: 'Full Gym', icon: '🏋️' },
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'minimal', label: 'Minimal', icon: '💪' },
]

const DAY_COLORS = {
  'Monday': '#00c853', 'Tuesday': '#2196f3', 'Wednesday': '#ff9800',
  'Thursday': '#e91e63', 'Friday': '#9c27b0', 'Saturday': '#00bcd4', 'Sunday': '#ff5722',
}

// ALL exercises matching Analytics EXERCISE_GROUP
export const ALL_EXERCISES = {
  Chest: [
    { name: 'Bench Press', value: 'bench_press' },
    { name: 'Incline Bench Press', value: 'incline_bench_press' },
    { name: 'Decline Bench Press', value: 'decline_bench_press' },
    { name: 'Incline DB Press', value: 'incline_db_press' },
    { name: 'Decline DB Press', value: 'decline_db_press' },
    { name: 'Flat DB Press', value: 'flat_db_press' },
    { name: 'Chest Fly', value: 'chest_fly' },
    { name: 'Incline DB Fly', value: 'incline_db_fly' },
    { name: 'Decline DB Fly', value: 'decline_db_fly' },
    { name: 'Cable Crossover', value: 'cable_crossover' },
    { name: 'Low Cable Fly', value: 'low_cable_fly' },
    { name: 'High Cable Fly', value: 'high_cable_fly' },
    { name: 'Push Up', value: 'pushup' },
    { name: 'Wide Push Up', value: 'wide_pushup' },
    { name: 'Diamond Push Up', value: 'diamond_pushup' },
    { name: 'Decline Push Up', value: 'decline_pushup' },
    { name: 'Incline Push Up', value: 'incline_pushup' },
    { name: 'Dips', value: 'dips' },
    { name: 'Pec Deck', value: 'pec_deck' },
    { name: 'Svend Press', value: 'svend_press' },
  ],
  Back: [
    { name: 'Pull Up', value: 'pullup' },
    { name: 'Chin Up', value: 'chinup' },
    { name: 'Wide Pull Up', value: 'wide_pullup' },
    { name: 'Lat Pulldown', value: 'lat_pulldown' },
    { name: 'Close Grip Pulldown', value: 'close_grip_pulldown' },
    { name: 'Seated Cable Row', value: 'seated_cable_row' },
    { name: 'One Arm DB Row', value: 'one_arm_db_row' },
    { name: 'Bent Over Row', value: 'bent_over_row' },
    { name: 'T-Bar Row', value: 't_bar_row' },
    { name: 'Chest Supported Row', value: 'chest_supported_row' },
    { name: 'Deadlift', value: 'deadlift' },
    { name: 'Romanian Deadlift', value: 'romanian_deadlift' },
    { name: 'Sumo Deadlift', value: 'sumo_deadlift' },
    { name: 'Rack Pull', value: 'rack_pull' },
    { name: 'Face Pull', value: 'face_pull' },
    { name: 'Barbell Shrug', value: 'barbell_shrug' },
    { name: 'DB Shrug', value: 'db_shrug' },
    { name: 'Straight Arm Pulldown', value: 'straight_arm_pulldown' },
    { name: 'Hyperextension', value: 'hyperextension' },
    { name: 'Good Morning', value: 'good_morning' },
  ],
  Shoulders: [
    { name: 'Shoulder Press', value: 'shoulder_press' },
    { name: 'Arnold Press', value: 'arnold_press' },
    { name: 'Military Press', value: 'military_press' },
    { name: 'DB Shoulder Press', value: 'db_shoulder_press' },
    { name: 'Lateral Raise', value: 'lateral_raise' },
    { name: 'Cable Lateral Raise', value: 'cable_lateral_raise' },
    { name: 'Front Raise', value: 'front_raise' },
    { name: 'Cable Front Raise', value: 'cable_front_raise' },
    { name: 'Upright Row', value: 'upright_row' },
    { name: 'Rear Delt Fly', value: 'rear_delt_fly' },
    { name: 'Cable Rear Delt Fly', value: 'cable_rear_delt_fly' },
    { name: 'Reverse Pec Deck', value: 'reverse_pec_deck' },
    { name: 'Landmine Press', value: 'landmine_press' },
    { name: 'Push Press', value: 'push_press' },
    { name: 'Behind Neck Press', value: 'behind_neck_press' },
  ],
  Biceps: [
    { name: 'Bicep Curl', value: 'bicep_curl' },
    { name: 'Barbell Curl', value: 'barbell_curl' },
    { name: 'Hammer Curl', value: 'hammer_curl' },
    { name: 'Concentration Curl', value: 'concentration_curl' },
    { name: 'Preacher Curl', value: 'preacher_curl' },
    { name: 'Cable Curl', value: 'cable_curl' },
    { name: 'Incline DB Curl', value: 'incline_db_curl' },
    { name: 'Spider Curl', value: 'spider_curl' },
    { name: 'Reverse Curl', value: 'reverse_curl' },
    { name: 'Zottman Curl', value: 'zottman_curl' },
    { name: 'Cross Body Curl', value: 'cross_body_curl' },
    { name: '21s Curl', value: '21s_curl' },
  ],
  Triceps: [
    { name: 'Tricep Extension', value: 'tricep_extension' },
    { name: 'Skull Crusher', value: 'skull_crusher' },
    { name: 'Tricep Pushdown', value: 'tricep_pushdown' },
    { name: 'Rope Pushdown', value: 'rope_pushdown' },
    { name: 'Tricep Dip', value: 'tricep_dip' },
    { name: 'Close Grip Bench', value: 'close_grip_bench' },
    { name: 'Overhead Tricep Extension', value: 'overhead_tricep_extension' },
    { name: 'Cable Overhead Extension', value: 'cable_overhead_extension' },
    { name: 'Kickback', value: 'kickback' },
    { name: 'Tate Press', value: 'tate_press' },
    { name: 'JM Press', value: 'jm_press' },
    { name: 'Bench Dip', value: 'bench_dip' },
  ],
  Legs: [
    { name: 'Squat', value: 'squat' },
    { name: 'Barbell Squat', value: 'barbell_squat' },
    { name: 'Front Squat', value: 'front_squat' },
    { name: 'Goblet Squat', value: 'goblet_squat' },
    { name: 'Hack Squat', value: 'hack_squat' },
    { name: 'Sumo Squat', value: 'sumo_squat' },
    { name: 'Bulgarian Split Squat', value: 'bulgarian_split_squat' },
    { name: 'Lunge', value: 'lunge' },
    { name: 'Walking Lunge', value: 'walking_lunge' },
    { name: 'Reverse Lunge', value: 'reverse_lunge' },
    { name: 'Leg Press', value: 'leg_press' },
    { name: 'Leg Extension', value: 'leg_extension' },
    { name: 'Leg Curl', value: 'leg_curl' },
    { name: 'Seated Leg Curl', value: 'seated_leg_curl' },
    { name: 'Hip Thrust', value: 'hip_thrust' },
    { name: 'Glute Bridge', value: 'glute_bridge' },
    { name: 'Calf Raise', value: 'calf_raise' },
    { name: 'Seated Calf Raise', value: 'seated_calf_raise' },
    { name: 'Wall Sit', value: 'wall_sit' },
    { name: 'Step Up', value: 'step_up' },
    { name: 'Box Jump', value: 'box_jump' },
    { name: 'Glute Kickback', value: 'glute_kickback' },
  ],
  Core: [
    { name: 'Plank', value: 'plank' },
    { name: 'Side Plank', value: 'side_plank' },
    { name: 'Crunch', value: 'crunch' },
    { name: 'Sit Up', value: 'situp' },
    { name: 'Leg Raise', value: 'leg_raise' },
    { name: 'Hanging Leg Raise', value: 'hanging_leg_raise' },
    { name: 'Mountain Climber', value: 'mountain_climber' },
    { name: 'Bicycle Crunch', value: 'bicycle_crunch' },
    { name: 'Russian Twist', value: 'russian_twist' },
    { name: 'Cable Crunch', value: 'cable_crunch' },
    { name: 'Ab Wheel Rollout', value: 'ab_wheel_rollout' },
    { name: 'Flutter Kick', value: 'flutter_kick' },
    { name: 'Dead Bug', value: 'dead_bug' },
    { name: 'Hollow Hold', value: 'hollow_hold' },
    { name: 'V Up', value: 'v_up' },
    { name: 'Toe Touch', value: 'toe_touch' },
  ],
  Cardio: [
    { name: 'Jumping Jack', value: 'jumping_jack' },
    { name: 'Burpee', value: 'burpee' },
    { name: 'High Knees', value: 'high_knees' },
    { name: 'Skipping', value: 'skipping' },
    { name: 'Jump Squat', value: 'jump_squat' },
    { name: 'Treadmill Run', value: 'treadmill_run' },
    { name: 'Cycling', value: 'cycling' },
    { name: 'Rowing Machine', value: 'rowing_machine' },
    { name: 'Stair Climber', value: 'stair_climber' },
    { name: 'Battle Ropes', value: 'battle_ropes' },
    { name: 'Sprint', value: 'sprint' },
  ],
  'Senior Friendly': [
    { name: 'Standing March', value: 'standing_march' },
    { name: 'Seated Leg Raise', value: 'seated_leg_raise' },
    { name: 'Arm Circle', value: 'arm_circle' },
    { name: 'Shoulder Roll', value: 'shoulder_roll' },
    { name: 'Seated Row Band', value: 'seated_row_band' },
    { name: 'Wall Push Up', value: 'wall_pushup' },
    { name: 'Chair Squat', value: 'chair_squat' },
    { name: 'Heel Raise', value: 'heel_raise' },
    { name: 'Seated Bicep Curl', value: 'seated_bicep_curl' },
    { name: 'Side Leg Raise', value: 'side_leg_raise' },
  ],
  Yoga: [
    { name: 'Warrior Pose', value: 'warrior_pose' },
    { name: 'Downward Dog', value: 'downward_dog' },
    { name: 'Tree Pose', value: 'tree_pose' },
    { name: 'Cobra Pose', value: 'cobra_pose' },
    { name: 'Child Pose', value: 'child_pose' },
    { name: 'Sun Salutation', value: 'sun_salutation' },
    { name: 'Cat Cow', value: 'cat_cow' },
    { name: 'Pigeon Pose', value: 'pigeon_pose' },
    { name: 'Bridge Pose', value: 'bridge_pose' },
    { name: 'Boat Pose', value: 'boat_pose' },
  ],
}

const GROUP_COLORS = {
  Chest: '#f97316', Back: '#3b82f6', Shoulders: '#a855f7',
  Biceps: '#ec4899', Triceps: '#14b8a6', Legs: '#eab308',
  Core: '#00c853', Cardio: '#ef4444', 'Senior Friendly': '#64748b', Yoga: '#8b5cf6'
}

function generatePlan(goal, level, daysPerWeek) {
  const plans = {
    build_muscle: {
      beginner: [
        { day: 'Monday', focus: 'Chest & Triceps', exercises: [
          { name: 'Bench Press', sets: 3, reps: '8-10' }, { name: 'Incline DB Press', sets: 3, reps: '10-12' },
          { name: 'Chest Fly', sets: 3, reps: '12-15' }, { name: 'Tricep Pushdown', sets: 3, reps: '12-15' },
          { name: 'Overhead Tricep Extension', sets: 3, reps: '12-15' },
        ]},
        { day: 'Tuesday', focus: 'Back & Biceps', exercises: [
          { name: 'Pull Up', sets: 3, reps: '6-8' }, { name: 'Bent Over Row', sets: 3, reps: '8-10' },
          { name: 'Lat Pulldown', sets: 3, reps: '10-12' }, { name: 'Bicep Curl', sets: 3, reps: '12-15' },
          { name: 'Hammer Curl', sets: 3, reps: '12-15' },
        ]},
        { day: 'Wednesday', focus: 'Rest & Recovery', rest: true, exercises: [] },
        { day: 'Thursday', focus: 'Shoulders', exercises: [
          { name: 'Shoulder Press', sets: 4, reps: '8-10' }, { name: 'Lateral Raise', sets: 3, reps: '12-15' },
          { name: 'Front Raise', sets: 3, reps: '12-15' }, { name: 'Face Pull', sets: 3, reps: '15-20' },
          { name: 'Rear Delt Fly', sets: 3, reps: '12-15' },
        ]},
        { day: 'Friday', focus: 'Legs', exercises: [
          { name: 'Squat', sets: 4, reps: '8-10' }, { name: 'Leg Press', sets: 3, reps: '10-12' },
          { name: 'Leg Curl', sets: 3, reps: '12-15' }, { name: 'Calf Raise', sets: 4, reps: '15-20' },
          { name: 'Hip Thrust', sets: 3, reps: '12-15' },
        ]},
        { day: 'Saturday', focus: 'Core', exercises: [
          { name: 'Plank', sets: 3, reps: '1 min' }, { name: 'Crunch', sets: 3, reps: '20' },
          { name: 'Russian Twist', sets: 3, reps: '20' }, { name: 'Hanging Leg Raise', sets: 3, reps: '15' },
          { name: 'Ab Wheel Rollout', sets: 3, reps: '10' },
        ]},
        { day: 'Sunday', focus: 'Rest & Recovery', rest: true, exercises: [] },
      ],
      intermediate: [
        { day: 'Monday', focus: 'Chest & Triceps', exercises: [
          { name: 'Bench Press', sets: 4, reps: '6-8' }, { name: 'Incline Bench Press', sets: 4, reps: '8-10' },
          { name: 'Cable Crossover', sets: 3, reps: '12-15' }, { name: 'Skull Crusher', sets: 3, reps: '10-12' },
          { name: 'Rope Pushdown', sets: 3, reps: '12-15' }, { name: 'Dips', sets: 3, reps: '10-12' },
        ]},
        { day: 'Tuesday', focus: 'Back & Biceps', exercises: [
          { name: 'Deadlift', sets: 4, reps: '5-6' }, { name: 'Pull Up', sets: 4, reps: '8-10' },
          { name: 'Seated Cable Row', sets: 3, reps: '10-12' }, { name: 'Preacher Curl', sets: 3, reps: '10-12' },
          { name: 'Barbell Curl', sets: 3, reps: '10-12' }, { name: 'Spider Curl', sets: 3, reps: '12-15' },
        ]},
        { day: 'Wednesday', focus: 'Rest & Recovery', rest: true, exercises: [] },
        { day: 'Thursday', focus: 'Shoulders & Traps', exercises: [
          { name: 'Military Press', sets: 4, reps: '6-8' }, { name: 'Arnold Press', sets: 3, reps: '10-12' },
          { name: 'Cable Lateral Raise', sets: 3, reps: '15' }, { name: 'Reverse Pec Deck', sets: 3, reps: '15' },
          { name: 'Barbell Shrug', sets: 4, reps: '12-15' },
        ]},
        { day: 'Friday', focus: 'Legs', exercises: [
          { name: 'Barbell Squat', sets: 4, reps: '6-8' }, { name: 'Romanian Deadlift', sets: 4, reps: '8-10' },
          { name: 'Bulgarian Split Squat', sets: 3, reps: '10 each' }, { name: 'Leg Extension', sets: 3, reps: '12-15' },
          { name: 'Seated Calf Raise', sets: 4, reps: '15-20' },
        ]},
        { day: 'Saturday', focus: 'Core & Cardio', exercises: [
          { name: 'Ab Wheel Rollout', sets: 3, reps: '12' }, { name: 'Hanging Leg Raise', sets: 3, reps: '15' },
          { name: 'Russian Twist', sets: 3, reps: '25' }, { name: 'Battle Ropes', sets: 4, reps: '30 sec' },
          { name: 'Burpee', sets: 3, reps: '15' },
        ]},
        { day: 'Sunday', focus: 'Rest & Recovery', rest: true, exercises: [] },
      ],
      advanced: [
        { day: 'Monday', focus: 'Heavy Chest', exercises: [
          { name: 'Bench Press', sets: 5, reps: '4-6' }, { name: 'Incline Bench Press', sets: 4, reps: '6-8' },
          { name: 'Decline Bench Press', sets: 3, reps: '8-10' }, { name: 'Pec Deck', sets: 3, reps: '12-15' },
          { name: 'Skull Crusher', sets: 4, reps: '8-10' }, { name: 'Close Grip Bench', sets: 3, reps: '8-10' },
        ]},
        { day: 'Tuesday', focus: 'Heavy Back', exercises: [
          { name: 'Deadlift', sets: 5, reps: '3-5' }, { name: 'Wide Pull Up', sets: 4, reps: '8-10' },
          { name: 'T-Bar Row', sets: 4, reps: '8-10' }, { name: 'One Arm DB Row', sets: 3, reps: '10-12' },
          { name: 'Straight Arm Pulldown', sets: 3, reps: '12-15' }, { name: 'Barbell Shrug', sets: 4, reps: '12' },
        ]},
        { day: 'Wednesday', focus: 'Shoulders & Arms', exercises: [
          { name: 'Military Press', sets: 5, reps: '5-6' }, { name: 'Push Press', sets: 3, reps: '6-8' },
          { name: 'Cable Lateral Raise', sets: 4, reps: '15' }, { name: 'Barbell Curl', sets: 4, reps: '6-8' },
          { name: '21s Curl', sets: 3, reps: '21' }, { name: 'Rope Pushdown', sets: 4, reps: '10-12' },
        ]},
        { day: 'Thursday', focus: 'Heavy Legs', exercises: [
          { name: 'Barbell Squat', sets: 5, reps: '4-6' }, { name: 'Front Squat', sets: 3, reps: '6-8' },
          { name: 'Hack Squat', sets: 3, reps: '8-10' }, { name: 'Romanian Deadlift', sets: 4, reps: '8-10' },
          { name: 'Hip Thrust', sets: 4, reps: '10-12' }, { name: 'Calf Raise', sets: 5, reps: '20' },
        ]},
        { day: 'Friday', focus: 'Push Volume', exercises: [
          { name: 'Incline DB Press', sets: 4, reps: '8-10' }, { name: 'Cable Crossover', sets: 4, reps: '12-15' },
          { name: 'Arnold Press', sets: 4, reps: '10-12' }, { name: 'Dips', sets: 4, reps: '12-15' },
          { name: 'Overhead Tricep Extension', sets: 3, reps: '12' }, { name: 'JM Press', sets: 3, reps: '10' },
        ]},
        { day: 'Saturday', focus: 'Pull Volume + Core', exercises: [
          { name: 'Chin Up', sets: 4, reps: '10-12' }, { name: 'Seated Cable Row', sets: 4, reps: '10-12' },
          { name: 'Face Pull', sets: 3, reps: '20' }, { name: 'Preacher Curl', sets: 4, reps: '10' },
          { name: 'Ab Wheel Rollout', sets: 4, reps: '15' }, { name: 'Hanging Leg Raise', sets: 4, reps: '15' },
        ]},
        { day: 'Sunday', focus: 'Rest & Recovery', rest: true, exercises: [] },
      ],
    },
    lose_weight: {
      beginner: [
        { day: 'Monday', focus: 'Full Body + Cardio', exercises: [
          { name: 'Jumping Jack', sets: 3, reps: '30 sec' }, { name: 'Squat', sets: 3, reps: '15' },
          { name: 'Push Up', sets: 3, reps: '10-12' }, { name: 'Burpee', sets: 3, reps: '10' },
          { name: 'Mountain Climber', sets: 3, reps: '30 sec' },
        ]},
        { day: 'Tuesday', focus: 'HIIT Cardio', exercises: [
          { name: 'High Knees', sets: 4, reps: '30 sec' }, { name: 'Burpee', sets: 4, reps: '10' },
          { name: 'Jump Squat', sets: 3, reps: '15' }, { name: 'Skipping', sets: 3, reps: '1 min' },
          { name: 'Box Jump', sets: 3, reps: '10' },
        ]},
        { day: 'Wednesday', focus: 'Active Recovery', rest: true, exercises: [] },
        { day: 'Thursday', focus: 'Strength + Cardio', exercises: [
          { name: 'Deadlift', sets: 3, reps: '10' }, { name: 'Lunge', sets: 3, reps: '12 each' },
          { name: 'Plank', sets: 3, reps: '45 sec' }, { name: 'Russian Twist', sets: 3, reps: '20' },
          { name: 'Bicycle Crunch', sets: 3, reps: '20' },
        ]},
        { day: 'Friday', focus: 'Full Body Circuit', exercises: [
          { name: 'Walking Lunge', sets: 3, reps: '20 steps' }, { name: 'Bent Over Row', sets: 3, reps: '12' },
          { name: 'Goblet Squat', sets: 3, reps: '15' }, { name: 'Battle Ropes', sets: 3, reps: '30 sec' },
          { name: 'Plank', sets: 3, reps: '1 min' },
        ]},
        { day: 'Saturday', focus: 'Cardio Burn', exercises: [
          { name: 'Treadmill Run', sets: 1, reps: '20 min' }, { name: 'Cycling', sets: 1, reps: '15 min' },
          { name: 'Stair Climber', sets: 1, reps: '10 min' }, { name: 'Sprint', sets: 5, reps: '100m' },
          { name: 'Jumping Jack', sets: 3, reps: '1 min' },
        ]},
        { day: 'Sunday', focus: 'Rest & Recovery', rest: true, exercises: [] },
      ],
      intermediate: [
        { day: 'Monday', focus: 'Upper HIIT', exercises: [
          { name: 'Bench Press', sets: 4, reps: '12' }, { name: 'Bent Over Row', sets: 4, reps: '12' },
          { name: 'Burpee', sets: 3, reps: '15' }, { name: 'Battle Ropes', sets: 3, reps: '30 sec' },
          { name: 'Mountain Climber', sets: 3, reps: '45 sec' },
        ]},
        { day: 'Tuesday', focus: 'Lower HIIT', exercises: [
          { name: 'Barbell Squat', sets: 4, reps: '12' }, { name: 'Romanian Deadlift', sets: 4, reps: '12' },
          { name: 'Jump Squat', sets: 3, reps: '20' }, { name: 'Box Jump', sets: 3, reps: '12' },
          { name: 'Sprint', sets: 5, reps: '100m' },
        ]},
        { day: 'Wednesday', focus: 'Cardio', exercises: [
          { name: 'Treadmill Run', sets: 1, reps: '30 min' }, { name: 'Rowing Machine', sets: 1, reps: '15 min' },
          { name: 'Cycling', sets: 1, reps: '20 min' }, { name: 'High Knees', sets: 3, reps: '1 min' },
          { name: 'Skipping', sets: 5, reps: '2 min' },
        ]},
        { day: 'Thursday', focus: 'Full Body Circuit', exercises: [
          { name: 'Deadlift', sets: 4, reps: '10' }, { name: 'Push Up', sets: 4, reps: '20' },
          { name: 'Pull Up', sets: 4, reps: '10' }, { name: 'Burpee', sets: 4, reps: '15' },
          { name: 'Plank', sets: 3, reps: '1 min' },
        ]},
        { day: 'Friday', focus: 'HIIT + Core', exercises: [
          { name: 'Battle Ropes', sets: 4, reps: '30 sec' }, { name: 'Mountain Climber', sets: 4, reps: '1 min' },
          { name: 'Ab Wheel Rollout', sets: 3, reps: '15' }, { name: 'Hanging Leg Raise', sets: 3, reps: '20' },
          { name: 'Russian Twist', sets: 3, reps: '30' },
        ]},
        { day: 'Saturday', focus: 'Long Cardio', exercises: [
          { name: 'Treadmill Run', sets: 1, reps: '45 min' }, { name: 'Stair Climber', sets: 1, reps: '20 min' },
          { name: 'Rowing Machine', sets: 1, reps: '15 min' },
        ]},
        { day: 'Sunday', focus: 'Rest & Recovery', rest: true, exercises: [] },
      ],
      advanced: [
        { day: 'Monday', focus: 'Strength + Metabolic', exercises: [
          { name: 'Bench Press', sets: 5, reps: '5' }, { name: 'Burpee', sets: 5, reps: '20' },
          { name: 'Battle Ropes', sets: 4, reps: '45 sec' }, { name: 'Mountain Climber', sets: 4, reps: '1 min' },
          { name: 'Sprint', sets: 6, reps: '100m' },
        ]},
        { day: 'Tuesday', focus: 'Lower Power + Cardio', exercises: [
          { name: 'Barbell Squat', sets: 5, reps: '5' }, { name: 'Box Jump', sets: 4, reps: '15' },
          { name: 'Jump Squat', sets: 4, reps: '20' }, { name: 'Stair Climber', sets: 1, reps: '20 min' },
          { name: 'Sprint', sets: 8, reps: '100m' },
        ]},
        { day: 'Wednesday', focus: 'Cardio Day', exercises: [
          { name: 'Treadmill Run', sets: 1, reps: '45 min' }, { name: 'Rowing Machine', sets: 1, reps: '20 min' },
          { name: 'Cycling', sets: 1, reps: '30 min' },
        ]},
        { day: 'Thursday', focus: 'Pull + HIIT', exercises: [
          { name: 'Deadlift', sets: 5, reps: '5' }, { name: 'Pull Up', sets: 4, reps: '12' },
          { name: 'Bent Over Row', sets: 4, reps: '10' }, { name: 'Battle Ropes', sets: 5, reps: '45 sec' },
          { name: 'Burpee', sets: 5, reps: '20' },
        ]},
        { day: 'Friday', focus: 'Full Body Circuit', exercises: [
          { name: 'Barbell Squat', sets: 3, reps: '10' }, { name: 'Bench Press', sets: 3, reps: '10' },
          { name: 'Deadlift', sets: 3, reps: '10' }, { name: 'Pull Up', sets: 3, reps: '10' },
          { name: 'Burpee', sets: 3, reps: '20' }, { name: 'Sprint', sets: 5, reps: '100m' },
        ]},
        { day: 'Saturday', focus: 'Long Cardio + Core', exercises: [
          { name: 'Treadmill Run', sets: 1, reps: '60 min' }, { name: 'Ab Wheel Rollout', sets: 4, reps: '20' },
          { name: 'Hanging Leg Raise', sets: 4, reps: '20' }, { name: 'Russian Twist', sets: 4, reps: '30' },
        ]},
        { day: 'Sunday', focus: 'Rest & Recovery', rest: true, exercises: [] },
      ],
    },
    improve_fitness: {
      beginner: [
        { day: 'Monday', focus: 'Upper Body', exercises: [
          { name: 'Push Up', sets: 3, reps: '12-15' }, { name: 'One Arm DB Row', sets: 3, reps: '12' },
          { name: 'Shoulder Press', sets: 3, reps: '12' }, { name: 'Bicep Curl', sets: 3, reps: '12' },
          { name: 'Tricep Dip', sets: 3, reps: '12' },
        ]},
        { day: 'Tuesday', focus: 'Cardio', exercises: [
          { name: 'Treadmill Run', sets: 1, reps: '20 min' }, { name: 'High Knees', sets: 3, reps: '1 min' },
          { name: 'Jumping Jack', sets: 3, reps: '1 min' }, { name: 'Skipping', sets: 3, reps: '2 min' },
          { name: 'Burpee', sets: 3, reps: '10' },
        ]},
        { day: 'Wednesday', focus: 'Rest & Recovery', rest: true, exercises: [] },
        { day: 'Thursday', focus: 'Lower Body', exercises: [
          { name: 'Squat', sets: 4, reps: '12-15' }, { name: 'Lunge', sets: 3, reps: '12 each' },
          { name: 'Hip Thrust', sets: 3, reps: '15' }, { name: 'Leg Raise', sets: 3, reps: '15' },
          { name: 'Calf Raise', sets: 3, reps: '20' },
        ]},
        { day: 'Friday', focus: 'Core & Flexibility', exercises: [
          { name: 'Plank', sets: 3, reps: '1 min' }, { name: 'Crunch', sets: 3, reps: '20' },
          { name: 'Russian Twist', sets: 3, reps: '20' }, { name: 'Dead Bug', sets: 3, reps: '10 each' },
          { name: 'Bicycle Crunch', sets: 3, reps: '20' },
        ]},
        { day: 'Saturday', focus: 'Yoga & Stretch', exercises: [
          { name: 'Downward Dog', sets: 3, reps: '30 sec' }, { name: 'Warrior Pose', sets: 2, reps: '30 sec each' },
          { name: 'Child Pose', sets: 3, reps: '1 min' }, { name: 'Cat Cow', sets: 3, reps: '10' },
          { name: 'Sun Salutation', sets: 3, reps: '5 rounds' },
        ]},
        { day: 'Sunday', focus: 'Rest & Recovery', rest: true, exercises: [] },
      ],
      intermediate: [
        { day: 'Monday', focus: 'Push + Core', exercises: [
          { name: 'Bench Press', sets: 4, reps: '10' }, { name: 'Shoulder Press', sets: 4, reps: '10' },
          { name: 'Tricep Pushdown', sets: 3, reps: '12' }, { name: 'Plank', sets: 3, reps: '1 min' },
          { name: 'Ab Wheel Rollout', sets: 3, reps: '12' },
        ]},
        { day: 'Tuesday', focus: 'Cardio Intervals', exercises: [
          { name: 'Sprint', sets: 8, reps: '100m' }, { name: 'Rowing Machine', sets: 1, reps: '15 min' },
          { name: 'Battle Ropes', sets: 4, reps: '30 sec' }, { name: 'Jump Squat', sets: 3, reps: '20' },
          { name: 'Burpee', sets: 3, reps: '15' },
        ]},
        { day: 'Wednesday', focus: 'Pull Day', exercises: [
          { name: 'Pull Up', sets: 4, reps: '8-10' }, { name: 'Bent Over Row', sets: 4, reps: '10' },
          { name: 'Lat Pulldown', sets: 3, reps: '12' }, { name: 'Barbell Curl', sets: 3, reps: '12' },
          { name: 'Face Pull', sets: 3, reps: '15' },
        ]},
        { day: 'Thursday', focus: 'Leg Power', exercises: [
          { name: 'Barbell Squat', sets: 4, reps: '8-10' }, { name: 'Romanian Deadlift', sets: 3, reps: '10' },
          { name: 'Box Jump', sets: 4, reps: '12' }, { name: 'Hip Thrust', sets: 3, reps: '15' },
          { name: 'Calf Raise', sets: 4, reps: '20' },
        ]},
        { day: 'Friday', focus: 'Full Body', exercises: [
          { name: 'Deadlift', sets: 3, reps: '8' }, { name: 'Bench Press', sets: 3, reps: '10' },
          { name: 'Pull Up', sets: 3, reps: '10' }, { name: 'Goblet Squat', sets: 3, reps: '15' },
          { name: 'Plank', sets: 3, reps: '1 min' },
        ]},
        { day: 'Saturday', focus: 'Yoga & Mobility', exercises: [
          { name: 'Sun Salutation', sets: 5, reps: '5 rounds' }, { name: 'Warrior Pose', sets: 3, reps: '30 sec each' },
          { name: 'Pigeon Pose', sets: 2, reps: '1 min each' }, { name: 'Bridge Pose', sets: 3, reps: '30 sec' },
          { name: 'Cat Cow', sets: 3, reps: '15' },
        ]},
        { day: 'Sunday', focus: 'Rest & Recovery', rest: true, exercises: [] },
      ],
      advanced: [
        { day: 'Monday', focus: 'Power Push', exercises: [
          { name: 'Bench Press', sets: 5, reps: '5' }, { name: 'Incline Bench Press', sets: 4, reps: '6-8' },
          { name: 'Military Press', sets: 4, reps: '6-8' }, { name: 'Dips', sets: 4, reps: '12' },
          { name: 'Battle Ropes', sets: 4, reps: '45 sec' },
        ]},
        { day: 'Tuesday', focus: 'Power Pull', exercises: [
          { name: 'Deadlift', sets: 5, reps: '5' }, { name: 'Wide Pull Up', sets: 4, reps: '10' },
          { name: 'T-Bar Row', sets: 4, reps: '8' }, { name: 'Face Pull', sets: 3, reps: '20' },
          { name: 'Barbell Shrug', sets: 4, reps: '15' },
        ]},
        { day: 'Wednesday', focus: 'Cardio + Core', exercises: [
          { name: 'Sprint', sets: 10, reps: '100m' }, { name: 'Rowing Machine', sets: 1, reps: '20 min' },
          { name: 'Ab Wheel Rollout', sets: 4, reps: '20' }, { name: 'Hanging Leg Raise', sets: 4, reps: '20' },
          { name: 'Russian Twist', sets: 3, reps: '30' },
        ]},
        { day: 'Thursday', focus: 'Power Legs', exercises: [
          { name: 'Barbell Squat', sets: 5, reps: '5' }, { name: 'Front Squat', sets: 3, reps: '6' },
          { name: 'Romanian Deadlift', sets: 4, reps: '8' }, { name: 'Box Jump', sets: 4, reps: '15' },
          { name: 'Hip Thrust', sets: 4, reps: '12' },
        ]},
        { day: 'Friday', focus: 'Hypertrophy', exercises: [
          { name: 'Incline DB Press', sets: 4, reps: '10-12' }, { name: 'Seated Cable Row', sets: 4, reps: '10-12' },
          { name: 'Arnold Press', sets: 4, reps: '10-12' }, { name: 'Barbell Curl', sets: 4, reps: '10' },
          { name: 'Skull Crusher', sets: 4, reps: '10' },
        ]},
        { day: 'Saturday', focus: 'Athletic Conditioning', exercises: [
          { name: 'Burpee', sets: 5, reps: '20' }, { name: 'Battle Ropes', sets: 5, reps: '45 sec' },
          { name: 'Jump Squat', sets: 5, reps: '20' }, { name: 'Mountain Climber', sets: 4, reps: '1 min' },
          { name: 'Sprint', sets: 8, reps: '100m' },
        ]},
        { day: 'Sunday', focus: 'Rest & Recovery', rest: true, exercises: [] },
      ],
    },
    maintain: {
      beginner: [
        { day: 'Monday', focus: 'Push Day', exercises: [
          { name: 'Bench Press', sets: 3, reps: '8-10' }, { name: 'Shoulder Press', sets: 3, reps: '10' },
          { name: 'Tricep Pushdown', sets: 3, reps: '12' }, { name: 'Lateral Raise', sets: 3, reps: '15' },
          { name: 'Push Up', sets: 2, reps: '15' },
        ]},
        { day: 'Tuesday', focus: 'Pull Day', exercises: [
          { name: 'Pull Up', sets: 3, reps: '8' }, { name: 'Bent Over Row', sets: 3, reps: '10' },
          { name: 'Bicep Curl', sets: 3, reps: '12' }, { name: 'Face Pull', sets: 3, reps: '15' },
          { name: 'Hammer Curl', sets: 2, reps: '12' },
        ]},
        { day: 'Wednesday', focus: 'Rest & Recovery', rest: true, exercises: [] },
        { day: 'Thursday', focus: 'Legs Day', exercises: [
          { name: 'Squat', sets: 4, reps: '8-10' }, { name: 'Romanian Deadlift', sets: 3, reps: '10' },
          { name: 'Leg Press', sets: 3, reps: '12' }, { name: 'Leg Curl', sets: 3, reps: '12' },
          { name: 'Calf Raise', sets: 4, reps: '20' },
        ]},
        { day: 'Friday', focus: 'Full Body', exercises: [
          { name: 'Deadlift', sets: 3, reps: '6-8' }, { name: 'Bench Press', sets: 3, reps: '8' },
          { name: 'Pull Up', sets: 3, reps: '8' }, { name: 'Plank', sets: 3, reps: '1 min' },
          { name: 'Goblet Squat', sets: 3, reps: '15' },
        ]},
        { day: 'Saturday', focus: 'Cardio + Core', exercises: [
          { name: 'Treadmill Run', sets: 1, reps: '20 min' }, { name: 'Cycling', sets: 1, reps: '15 min' },
          { name: 'Crunch', sets: 3, reps: '20' }, { name: 'Russian Twist', sets: 3, reps: '20' },
          { name: 'Plank', sets: 3, reps: '1 min' },
        ]},
        { day: 'Sunday', focus: 'Rest & Recovery', rest: true, exercises: [] },
      ],
      intermediate: [
        { day: 'Monday', focus: 'Push', exercises: [
          { name: 'Bench Press', sets: 4, reps: '8' }, { name: 'Incline DB Press', sets: 3, reps: '10' },
          { name: 'Arnold Press', sets: 3, reps: '10' }, { name: 'Rope Pushdown', sets: 3, reps: '12' },
          { name: 'Lateral Raise', sets: 3, reps: '15' },
        ]},
        { day: 'Tuesday', focus: 'Pull', exercises: [
          { name: 'Deadlift', sets: 4, reps: '6' }, { name: 'Wide Pull Up', sets: 3, reps: '10' },
          { name: 'Seated Cable Row', sets: 3, reps: '10' }, { name: 'Preacher Curl', sets: 3, reps: '12' },
          { name: 'Face Pull', sets: 3, reps: '15' },
        ]},
        { day: 'Wednesday', focus: 'Cardio', exercises: [
          { name: 'Treadmill Run', sets: 1, reps: '30 min' }, { name: 'Stair Climber', sets: 1, reps: '15 min' },
          { name: 'Cycling', sets: 1, reps: '20 min' },
        ]},
        { day: 'Thursday', focus: 'Legs', exercises: [
          { name: 'Barbell Squat', sets: 4, reps: '8' }, { name: 'Romanian Deadlift', sets: 4, reps: '10' },
          { name: 'Leg Extension', sets: 3, reps: '12' }, { name: 'Seated Leg Curl', sets: 3, reps: '12' },
          { name: 'Calf Raise', sets: 4, reps: '20' },
        ]},
        { day: 'Friday', focus: 'Full Body + Core', exercises: [
          { name: 'Deadlift', sets: 3, reps: '6' }, { name: 'Push Up', sets: 3, reps: '20' },
          { name: 'Pull Up', sets: 3, reps: '10' }, { name: 'Ab Wheel Rollout', sets: 3, reps: '15' },
          { name: 'Hanging Leg Raise', sets: 3, reps: '15' },
        ]},
        { day: 'Saturday', focus: 'Yoga & Mobility', exercises: [
          { name: 'Sun Salutation', sets: 3, reps: '5 rounds' }, { name: 'Warrior Pose', sets: 3, reps: '30 sec' },
          { name: 'Pigeon Pose', sets: 2, reps: '1 min each' }, { name: 'Child Pose', sets: 3, reps: '1 min' },
          { name: 'Cat Cow', sets: 3, reps: '15' },
        ]},
        { day: 'Sunday', focus: 'Rest & Recovery', rest: true, exercises: [] },
      ],
      advanced: [
        { day: 'Monday', focus: 'Heavy Push', exercises: [
          { name: 'Bench Press', sets: 5, reps: '5' }, { name: 'Military Press', sets: 4, reps: '5' },
          { name: 'Incline Bench Press', sets: 3, reps: '8' }, { name: 'Close Grip Bench', sets: 3, reps: '8' },
          { name: 'Lateral Raise', sets: 4, reps: '15' },
        ]},
        { day: 'Tuesday', focus: 'Heavy Pull', exercises: [
          { name: 'Deadlift', sets: 5, reps: '5' }, { name: 'Weighted Pull Up', sets: 4, reps: '6' },
          { name: 'T-Bar Row', sets: 4, reps: '8' }, { name: 'Barbell Curl', sets: 3, reps: '8' },
          { name: 'Barbell Shrug', sets: 4, reps: '12' },
        ]},
        { day: 'Wednesday', focus: 'Cardio + Mobility', exercises: [
          { name: 'Treadmill Run', sets: 1, reps: '40 min' }, { name: 'Rowing Machine', sets: 1, reps: '20 min' },
          { name: 'Sun Salutation', sets: 5, reps: '5 rounds' }, { name: 'Pigeon Pose', sets: 3, reps: '1 min each' },
        ]},
        { day: 'Thursday', focus: 'Heavy Legs', exercises: [
          { name: 'Barbell Squat', sets: 5, reps: '5' }, { name: 'Romanian Deadlift', sets: 4, reps: '6' },
          { name: 'Hack Squat', sets: 3, reps: '8' }, { name: 'Hip Thrust', sets: 4, reps: '10' },
          { name: 'Seated Calf Raise', sets: 5, reps: '20' },
        ]},
        { day: 'Friday', focus: 'Volume Day', exercises: [
          { name: 'Incline DB Press', sets: 4, reps: '10' }, { name: 'One Arm DB Row', sets: 4, reps: '10' },
          { name: 'Arnold Press', sets: 4, reps: '10' }, { name: 'Bulgarian Split Squat', sets: 3, reps: '10 each' },
          { name: 'Ab Wheel Rollout', sets: 4, reps: '15' },
        ]},
        { day: 'Saturday', focus: 'Conditioning', exercises: [
          { name: 'Battle Ropes', sets: 5, reps: '45 sec' }, { name: 'Box Jump', sets: 4, reps: '15' },
          { name: 'Sprint', sets: 8, reps: '100m' }, { name: 'Hanging Leg Raise', sets: 4, reps: '20' },
          { name: 'Russian Twist', sets: 4, reps: '30' },
        ]},
        { day: 'Sunday', focus: 'Rest & Recovery', rest: true, exercises: [] },
      ],
    },
  }

  const goalPlan = plans[goal] || plans['build_muscle']
  const levelPlan = goalPlan[level] || goalPlan['beginner']
  return levelPlan
}

const TIPS = {
  lose_weight: [
    'Maintain a caloric deficit of 300-500 calories per day',
    'Aim for 150+ minutes of cardio per week',
    'Prioritize protein (1.6g per kg bodyweight) to preserve muscle',
    'Stay hydrated — drink 3+ liters of water daily',
    'Sleep 7-9 hours for optimal fat loss hormones',
  ],
  build_muscle: [
    'Eat in a caloric surplus of 200-300 calories per day',
    'Prioritize compound movements for maximum growth',
    'Progressive overload — add weight every 1-2 weeks',
    'Get 1.6-2.2g protein per kg bodyweight daily',
    'Rest 48-72 hours before training same muscle group',
  ],
  improve_fitness: [
    'Combine strength and cardio for best results',
    'Track your workouts to monitor progress',
    'Gradually increase intensity each week',
    'Focus on form before adding weight',
    'Consistency beats intensity every time',
  ],
  maintain: [
    'Keep calories at maintenance level',
    'Focus on strength retention with progressive overload',
    'Deload every 6-8 weeks to prevent burnout',
    'Mix up your routine every 8-12 weeks',
    'Sleep and recovery are as important as training',
  ],
}

export default function WorkoutPlanner() {
  const [form, setForm] = useState({ fitness_level: 'beginner', goal: 'build_muscle', days_per_week: 5, equipment: 'gym' })
  const [plan, setPlan] = useState(null)
  const [activeDay, setActiveDay] = useState(0)
  const [generated, setGenerated] = useState(false)
  const [showExerciseList, setShowExerciseList] = useState(false)
  const [expandedGroup, setExpandedGroup] = useState(null)

  const selectedGoal = GOALS.find(g => g.value === form.goal)

  const handleGenerate = () => {
    const generatedPlan = generatePlan(form.goal, form.fitness_level, form.days_per_week)
    setPlan(generatedPlan)
    setActiveDay(0)
    setGenerated(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '0 0 60px 0' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1f0f 0%, #0a0a0a 50%, #0f0f1f 100%)',
        padding: '40px 40px 32px', borderBottom: '1px solid #1a1a1a',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '2rem' }}>{selectedGoal?.icon}</span>
            <div>
              <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>AI Workout Planner</h1>
              <p style={{ color: '#555', margin: 0, fontSize: '0.85rem' }}>Personalized weekly training programs</p>
            </div>
          </div>
          <button onClick={() => setShowExerciseList(!showExerciseList)} style={{
            padding: '10px 20px', background: showExerciseList ? '#00c853' : '#1a1a1a',
            color: showExerciseList ? '#000' : '#888', border: 'none', borderRadius: 10,
            fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem'
          }}>
            {showExerciseList ? '✕ Close' : '📋 All Exercises'}
          </button>
        </div>
      </div>

      <div style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Exercise Library Panel */}
        {showExerciseList && (
          <div style={{
            background: '#111', borderRadius: 20, padding: 24,
            border: '1px solid #1e1e1e', marginBottom: 28
          }}>
            <h3 style={{ color: '#fff', margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 700 }}>
              💪 Exercise Library — {Object.values(ALL_EXERCISES).flat().length}+ Exercises
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {Object.entries(ALL_EXERCISES).map(([group, exercises]) => (
                <div key={group} style={{ background: '#161616', borderRadius: 12, overflow: 'hidden', border: `1px solid ${GROUP_COLORS[group]}33` }}>
                  <button onClick={() => setExpandedGroup(expandedGroup === group ? null : group)}
                    style={{
                      width: '100%', padding: '12px 16px', background: 'transparent', border: 'none',
                      cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                    <span style={{ color: GROUP_COLORS[group], fontWeight: 700, fontSize: '0.9rem' }}>{group}</span>
                    <span style={{ color: '#555', fontSize: '0.75rem' }}>{exercises.length} exercises {expandedGroup === group ? '▲' : '▼'}</span>
                  </button>
                  {expandedGroup === group && (
                    <div style={{ padding: '0 12px 12px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {exercises.map(ex => (
                        <span key={ex.value} style={{
                          padding: '4px 10px', background: `${GROUP_COLORS[group]}15`,
                          color: '#aaa', borderRadius: 20, fontSize: '0.75rem',
                          border: `1px solid ${GROUP_COLORS[group]}33`
                        }}>{ex.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Config Panel */}
        <div style={{ background: '#111', borderRadius: 20, padding: 28, border: '1px solid #1e1e1e', marginBottom: 32 }}>
          <h3 style={{ color: '#666', fontSize: '0.75rem', letterSpacing: '2px', margin: '0 0 20px', textTransform: 'uppercase' }}>
            Configure Your Plan
          </h3>

          {/* Goal */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ color: '#555', fontSize: '0.75rem', letterSpacing: '1px', display: 'block', marginBottom: 10, textTransform: 'uppercase' }}>Goal</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {GOALS.map(g => (
                <button key={g.value} onClick={() => setForm({ ...form, goal: g.value })} style={{
                  padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.88rem',
                  background: form.goal === g.value ? g.color : '#1a1a1a',
                  color: form.goal === g.value ? '#000' : '#666',
                  transform: form.goal === g.value ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: form.goal === g.value ? `0 4px 16px ${g.color}44` : 'none',
                  transition: 'all 0.2s'
                }}>{g.icon} {g.label}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {/* Level */}
            <div>
              <label style={{ color: '#555', fontSize: '0.75rem', letterSpacing: '1px', display: 'block', marginBottom: 10, textTransform: 'uppercase' }}>Fitness Level</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {LEVELS.map(l => (
                  <button key={l.value} onClick={() => setForm({ ...form, fitness_level: l.value })} style={{
                    padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: form.fitness_level === l.value ? '#1e2e1e' : '#161616',
                    borderLeft: form.fitness_level === l.value ? '3px solid #00c853' : '3px solid transparent',
                    transition: 'all 0.2s'
                  }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: form.fitness_level === l.value ? '#00c853' : '#555' }}>{l.icon} {l.label}</span>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#444', marginTop: 2 }}>{l.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label style={{ color: '#555', fontSize: '0.75rem', letterSpacing: '1px', display: 'block', marginBottom: 10, textTransform: 'uppercase' }}>Equipment</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {EQUIPMENT.map(e => (
                  <button key={e.value} onClick={() => setForm({ ...form, equipment: e.value })} style={{
                    padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: form.equipment === e.value ? '#1e2e1e' : '#161616',
                    borderLeft: form.equipment === e.value ? '3px solid #00c853' : '3px solid transparent',
                    transition: 'all 0.2s'
                  }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: form.equipment === e.value ? '#00c853' : '#555' }}>{e.icon} {e.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Days */}
            <div>
              <label style={{ color: '#555', fontSize: '0.75rem', letterSpacing: '1px', display: 'block', marginBottom: 10, textTransform: 'uppercase' }}>Days Per Week</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[2, 3, 4, 5, 6].map(d => (
                  <button key={d} onClick={() => setForm({ ...form, days_per_week: d })} style={{
                    width: 44, height: 44, borderRadius: 10, border: 'none', cursor: 'pointer',
                    fontWeight: 700, fontSize: '1rem',
                    background: form.days_per_week === d ? '#00c853' : '#1a1a1a',
                    color: form.days_per_week === d ? '#000' : '#555',
                    boxShadow: form.days_per_week === d ? '0 4px 12px #00c85344' : 'none',
                    transition: 'all 0.2s'
                  }}>{d}</button>
                ))}
              </div>
              <p style={{ color: '#444', fontSize: '0.75rem', marginTop: 10 }}>{form.days_per_week} training days + {7 - form.days_per_week} rest days</p>
            </div>
          </div>

          <button onClick={handleGenerate} style={{
            marginTop: 24, padding: '14px 40px',
            background: selectedGoal?.color || '#00c853',
            color: '#000', border: 'none', borderRadius: 12,
            fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
            boxShadow: `0 6px 20px ${selectedGoal?.color || '#00c853'}44`,
            transition: 'all 0.2s'
          }}>✨ Generate My {form.days_per_week}-Day Plan</button>
        </div>

        {/* Plan Output */}
        {plan && generated && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
              {plan.map((day, i) => (
                <button key={i} onClick={() => setActiveDay(i)} style={{
                  flex: '0 0 auto', padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: activeDay === i ? (day.rest ? '#333' : DAY_COLORS[day.day] || '#00c853') : '#111',
                  color: activeDay === i ? (day.rest ? '#fff' : '#000') : '#555',
                  fontWeight: 700, fontSize: '0.8rem',
                  borderBottom: activeDay !== i && !day.rest ? `2px solid ${DAY_COLORS[day.day]}44` : '2px solid transparent',
                  opacity: day.rest && activeDay !== i ? 0.5 : 1, transition: 'all 0.2s'
                }}>
                  <div>{day.day.slice(0, 3).toUpperCase()}</div>
                  <div style={{ fontSize: '0.65rem', marginTop: 2, fontWeight: 400 }}>
                    {day.rest ? 'REST' : day.focus.split(' ')[0].toUpperCase()}
                  </div>
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
              <div style={{ background: '#111', borderRadius: 20, overflow: 'hidden', border: '1px solid #1e1e1e' }}>
                <div style={{
                  padding: '20px 24px',
                  background: plan[activeDay].rest ? '#161616' : `linear-gradient(135deg, ${DAY_COLORS[plan[activeDay].day]}15, transparent)`,
                  borderBottom: '1px solid #1a1a1a',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <h3 style={{ color: '#fff', margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{plan[activeDay].day}</h3>
                    <span style={{ color: plan[activeDay].rest ? '#555' : DAY_COLORS[plan[activeDay].day], fontSize: '0.85rem' }}>
                      {plan[activeDay].focus}
                    </span>
                  </div>
                  {!plan[activeDay].rest && (
                    <div style={{
                      background: `${DAY_COLORS[plan[activeDay].day]}22`,
                      color: DAY_COLORS[plan[activeDay].day],
                      padding: '6px 14px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600
                    }}>{plan[activeDay].exercises.length} exercises</div>
                  )}
                </div>

                {plan[activeDay].rest ? (
                  <div style={{ padding: 40, textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 12 }}>😴</div>
                    <h3 style={{ color: '#555', margin: 0 }}>Rest & Recovery Day</h3>
                    <p style={{ color: '#333', fontSize: '0.85rem', marginTop: 8 }}>Allow your muscles to recover. Light walking or stretching is fine.</p>
                  </div>
                ) : (
                  <div style={{ padding: '8px 0' }}>
                    {plan[activeDay].exercises.map((ex, j) => (
                      <div key={j} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 24px',
                        borderBottom: j < plan[activeDay].exercises.length - 1 ? '1px solid #161616' : 'none',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: `${DAY_COLORS[plan[activeDay].day]}22`,
                            color: DAY_COLORS[plan[activeDay].day],
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                          }}>{j + 1}</div>
                          <span style={{ color: '#ddd', fontSize: '0.95rem', fontWeight: 500 }}>{ex.name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <span style={{ background: '#1a1a1a', color: '#888', padding: '4px 10px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600 }}>{ex.sets} sets</span>
                          <span style={{ background: `${DAY_COLORS[plan[activeDay].day]}18`, color: DAY_COLORS[plan[activeDay].day], padding: '4px 10px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600 }}>{ex.reps} reps</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: '#111', borderRadius: 16, padding: 20, border: '1px solid #1e1e1e' }}>
                  <h4 style={{ color: '#555', fontSize: '0.7rem', letterSpacing: '1.5px', margin: '0 0 16px', textTransform: 'uppercase' }}>Week Summary</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { label: 'Training Days', value: form.days_per_week, color: '#00c853' },
                      { label: 'Rest Days', value: 7 - form.days_per_week, color: '#666' },
                      { label: 'Total Exercises', value: plan.reduce((a, d) => a + (d.exercises?.length || 0), 0), color: '#2196f3' },
                      { label: 'Total Sets', value: plan.reduce((a, d) => a + (d.exercises?.reduce((b, e) => b + e.sets, 0) || 0), 0), color: '#ff9800' },
                    ].map((s, i) => (
                      <div key={i} style={{ background: '#161616', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                        <div style={{ color: s.color, fontSize: '1.4rem', fontWeight: 800 }}>{s.value}</div>
                        <div style={{ color: '#444', fontSize: '0.7rem', marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#111', borderRadius: 16, padding: 20, border: '1px solid #1e1e1e', flex: 1 }}>
                  <h4 style={{ color: '#555', fontSize: '0.7rem', letterSpacing: '1.5px', margin: '0 0 14px', textTransform: 'uppercase' }}>💡 Pro Tips</h4>
                  {(TIPS[form.goal] || TIPS['build_muscle']).map((tip, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12, paddingBottom: 12, borderBottom: i < 4 ? '1px solid #161616' : 'none' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: selectedGoal?.color || '#00c853', flexShrink: 0, marginTop: 6 }} />
                      <span style={{ color: '#666', fontSize: '0.8rem', lineHeight: 1.5 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
