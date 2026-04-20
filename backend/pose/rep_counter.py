class RepCounter:
    EXERCISES = {
        # ==================== CHEST ====================
        "bench_press": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 160},
        "incline_bench_press": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 160},
        "decline_bench_press": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 160},
        "pushup": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 160},
        "wide_pushup": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 160},
        "diamond_pushup": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 160},
        "incline_pushup": {"joints": [11, 13, 15], "down_angle": 100, "up_angle": 160},
        "decline_pushup": {"joints": [11, 13, 15], "down_angle": 80, "up_angle": 160},
        "chest_press": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 160},
        "incline_db_press": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 160},
        "decline_db_press": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 160},
        "chest_fly": {"joints": [11, 13, 15], "down_angle": 140, "up_angle": 90},
        "incline_db_fly": {"joints": [11, 13, 15], "down_angle": 140, "up_angle": 90},
        "cable_crossover": {"joints": [11, 13, 15], "down_angle": 140, "up_angle": 90},
        "high_cable_crossover": {"joints": [11, 13, 15], "down_angle": 140, "up_angle": 90},
        "low_cable_crossover": {"joints": [11, 13, 15], "down_angle": 140, "up_angle": 90},
        "pec_deck": {"joints": [11, 13, 15], "down_angle": 140, "up_angle": 90},
        "dips": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 160},
        "parallel_bar_dips": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 160},
        "dips_behind_hips": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 160},

        # ==================== BACK ====================
        "pullup": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 60},
        "chinup": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 60},
        "lat_pulldown": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 60},
        "close_grip_lat_pulldown": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 60},
        "reverse_lat_pulldown": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 60},
        "straight_arm_pulldown": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 90},
        "seated_cable_row": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 160},
        "low_pulley_row": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 160},
        "one_arm_db_row": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 60},
        "one_arm_cable_row": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 60},
        "bent_over_row": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 130},
        "t_bar_row": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 130},
        "vertical_row": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 60},
        "barbell_pullover": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 90},
        "deadlift": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 160},
        "romanian_deadlift": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 160},
        "sumo_deadlift": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 160},
        "back_hyperextension": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 160},
        "reverse_pec_fly": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 140},
        "face_pull": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 60},
        "plate_shrug": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 130},
        "barbell_shrug": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 130},
        "db_shrug": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 130},

        # ==================== SHOULDERS ====================
        "shoulder_press": {"joints": [11, 13, 15], "down_angle": 80, "up_angle": 160},
        "arnold_press": {"joints": [11, 13, 15], "down_angle": 80, "up_angle": 160},
        "military_press": {"joints": [11, 13, 15], "down_angle": 80, "up_angle": 160},
        "db_shoulder_press": {"joints": [11, 13, 15], "down_angle": 80, "up_angle": 160},
        "machine_shoulder_press": {"joints": [11, 13, 15], "down_angle": 80, "up_angle": 160},
        "lateral_raise": {"joints": [23, 11, 13], "down_angle": 160, "up_angle": 70},
        "cable_lateral_raise": {"joints": [23, 11, 13], "down_angle": 160, "up_angle": 70},
        "seated_lateral_raise": {"joints": [23, 11, 13], "down_angle": 160, "up_angle": 70},
        "front_raise": {"joints": [23, 11, 13], "down_angle": 160, "up_angle": 80},
        "db_front_raise": {"joints": [23, 11, 13], "down_angle": 160, "up_angle": 80},
        "cable_front_raise": {"joints": [23, 11, 13], "down_angle": 160, "up_angle": 80},
        "upright_row": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 60},
        "cable_upright_row": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 60},
        "rear_delt_fly": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 140},

        # ==================== BICEPS ====================
        "bicep_curl": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 40},
        "barbell_curl": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 40},
        "ez_bar_curl": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 40},
        "hammer_curl": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 40},
        "concentration_curl": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 40},
        "preacher_curl": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 40},
        "preacher_db_curl": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 40},
        "incline_db_curl": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 40},
        "cable_curl": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 40},
        "standing_cable_curl": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 40},
        "spider_curl": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 40},
        "reverse_curl": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 40},
        "21s_curl": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 40},

        # ==================== TRICEPS ====================
        "tricep_extension": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 90},
        "overhead_tricep_extension": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 160},
        "skull_crusher": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 160},
        "tricep_pushdown": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 90},
        "rope_pushdown": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 90},
        "v_bar_pushdown": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 90},
        "reverse_grip_pushdown": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 90},
        "one_arm_pushdown": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 90},
        "tricep_dip": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 160},
        "cable_kickback": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 90},
        "oh_cable_extension": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 160},
        "close_grip_bench": {"joints": [11, 13, 15], "down_angle": 90, "up_angle": 160},

        # ==================== LEGS ====================
        "squat": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "barbell_squat": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "front_squat": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "sumo_squat": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "goblet_squat": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "hack_squat": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "duck_press": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "jump_squat": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "chair_squat": {"joints": [23, 25, 27], "down_angle": 100, "up_angle": 160},
        "pistol_squat": {"joints": [23, 25, 27], "down_angle": 80, "up_angle": 160},
        "lunge": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "walking_lunge": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "reverse_lunge": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "lateral_lunge": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "leg_press": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "leg_extension": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "leg_curl": {"joints": [23, 25, 27], "down_angle": 160, "up_angle": 90},
        "seated_leg_curl": {"joints": [23, 25, 27], "down_angle": 160, "up_angle": 90},
        "hip_thrust": {"joints": [11, 23, 25], "down_angle": 130, "up_angle": 160},
        "glute_bridge": {"joints": [11, 23, 25], "down_angle": 130, "up_angle": 160},
        "cable_hip_extension": {"joints": [23, 25, 27], "down_angle": 160, "up_angle": 120},
        "donkey_kick": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "step_up": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "box_jump": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "wall_sit": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 91},
        "calf_raise": {"joints": [25, 27, 31], "down_angle": 160, "up_angle": 130},
        "seated_calf_raise": {"joints": [25, 27, 31], "down_angle": 160, "up_angle": 130},
        "standing_calf_raise": {"joints": [25, 27, 31], "down_angle": 160, "up_angle": 130},

        # ==================== CORE ====================
        "plank": {"joints": [11, 23, 25], "down_angle": 160, "up_angle": 140},
        "side_plank": {"joints": [11, 23, 25], "down_angle": 160, "up_angle": 140},
        "crunch": {"joints": [11, 23, 25], "down_angle": 120, "up_angle": 160},
        "situp": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 160},
        "v_up": {"joints": [11, 23, 25], "down_angle": 160, "up_angle": 90},
        "ab_bench_crunch": {"joints": [11, 23, 25], "down_angle": 120, "up_angle": 160},
        "cable_crunch": {"joints": [11, 23, 25], "down_angle": 120, "up_angle": 160},
        "leg_raise": {"joints": [23, 25, 27], "down_angle": 160, "up_angle": 90},
        "hanging_leg_raise": {"joints": [23, 25, 27], "down_angle": 160, "up_angle": 90},
        "vertical_knee_up": {"joints": [23, 25, 27], "down_angle": 160, "up_angle": 90},
        "mountain_climber": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 160},
        "bicycle_crunch": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 160},
        "russian_twist": {"joints": [11, 23, 25], "down_angle": 120, "up_angle": 160},
        "flutter_kick": {"joints": [23, 25, 27], "down_angle": 160, "up_angle": 130},
        "toe_touch": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 160},
        "wood_chop": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 160},
        "dead_bug": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 160},

        # ==================== CARDIO ====================
        "jumping_jack": {"joints": [23, 11, 13], "down_angle": 30, "up_angle": 160},
        "burpee": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 160},
        "high_knees": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "skipping": {"joints": [23, 25, 27], "down_angle": 160, "up_angle": 130},
        "running_in_place": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "butt_kicks": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "lateral_shuffle": {"joints": [23, 25, 27], "down_angle": 120, "up_angle": 160},
        "speed_skater": {"joints": [23, 25, 27], "down_angle": 110, "up_angle": 160},

        # ==================== SENIOR / BEGINNER ====================
        "standing_march": {"joints": [23, 25, 27], "down_angle": 130, "up_angle": 160},
        "toe_tap": {"joints": [23, 25, 27], "down_angle": 140, "up_angle": 160},
        "seated_leg_raise": {"joints": [23, 25, 27], "down_angle": 160, "up_angle": 130},
        "arm_circle": {"joints": [23, 11, 13], "down_angle": 160, "up_angle": 60},
        "shoulder_roll": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 120},
        "ankle_rotation": {"joints": [25, 27, 31], "down_angle": 160, "up_angle": 130},
        "neck_roll": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 120},
        "wrist_rotation": {"joints": [11, 13, 15], "down_angle": 160, "up_angle": 120},
        "heel_toe_walk": {"joints": [25, 27, 31], "down_angle": 160, "up_angle": 130},

        # ==================== YOGA / STRETCHING ====================
        "warrior_pose": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "downward_dog": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 160},
        "tree_pose": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "cobra_pose": {"joints": [11, 23, 25], "down_angle": 120, "up_angle": 160},
        "child_pose": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 160},
        "cat_cow": {"joints": [11, 23, 25], "down_angle": 120, "up_angle": 160},
        "bridge_pose": {"joints": [11, 23, 25], "down_angle": 130, "up_angle": 160},
        "pigeon_pose": {"joints": [23, 25, 27], "down_angle": 90, "up_angle": 160},
        "seated_forward_bend": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 160},
        "standing_forward_bend": {"joints": [11, 23, 25], "down_angle": 90, "up_angle": 160},
    }

    def __init__(self, exercise="bicep_curl"):
        if exercise not in self.EXERCISES:
            exercise = "bicep_curl"
        self.exercise = exercise
        self.config = self.EXERCISES[exercise]
        self.count = 0
        self.stage = None
        self.angle = 0

    def update(self, angle):
        if angle is None:
            return {"count": self.count, "stage": self.stage, "angle": 0}
        self.angle = angle
        down_thresh = self.config["down_angle"]
        up_thresh = self.config["up_angle"]
        if angle > down_thresh:
            self.stage = "down"
        if angle < up_thresh and self.stage == "down":
            self.stage = "up"
            self.count += 1
        return {
            "count": self.count,
            "stage": self.stage,
            "angle": angle
        }

    def reset(self):
        self.count = 0
        self.stage = None