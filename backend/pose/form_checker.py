class FormChecker:
    def __init__(self):
        self.feedback = []

    def check_bicep_curl(self, landmarks):
        """Returns list of form issues found."""
        issues = []

        # Check elbow stays close to body (elbow x should be near shoulder x)
        try:
            shoulder_x = landmarks[11]['x']
            elbow_x = landmarks[13]['x']
            if abs(elbow_x - shoulder_x) > 60:
                issues.append("Keep your elbow close to your body")

            # Check wrist doesn't rotate excessively
            wrist_vis = landmarks[15]['visibility']
            if wrist_vis < 0.5:
                issues.append("Wrist not visible — adjust camera angle")

        except KeyError:
            issues.append("Landmarks not fully detected")

        return issues

    def check_squat(self, landmarks):
        issues = []
        try:
            # Knee should not go past toes (knee x vs ankle x)
            knee_x = landmarks[25]['x']
            ankle_x = landmarks[27]['x']
            if knee_x > ankle_x + 40:
                issues.append("Don't let your knees go past your toes")

            # Back should stay upright (shoulder y vs hip y delta)
            shoulder_y = landmarks[11]['y']
            hip_y = landmarks[23]['y']
            if hip_y - shoulder_y < 80:
                issues.append("Keep your back straight")

        except KeyError:
            issues.append("Landmarks not fully detected")

        return issues

    def check(self, exercise, landmarks):
        if exercise == "bicep_curl":
            return self.check_bicep_curl(landmarks)
        elif exercise == "squat":
            return self.check_squat(landmarks)
        return []