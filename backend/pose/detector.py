import cv2
import mediapipe as mp
import numpy as np

class PoseDetector:
    def __init__(self, min_detection_confidence=0.7, min_tracking_confidence=0.7):
        self.pose = mp.solutions.pose.Pose(
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence,
            model_complexity=1
        )
        self.mp_pose = mp.solutions.pose
        self.mp_draw = mp.solutions.drawing_utils
        self.results = None

    def find_pose(self, frame, draw=True):
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        self.results = self.pose.process(rgb)
        if self.results.pose_landmarks and draw:
            self.mp_draw.draw_landmarks(frame, self.results.pose_landmarks, self.mp_pose.POSE_CONNECTIONS)
        return frame

    def get_landmarks(self, frame):
        landmarks = {}
        if self.results and self.results.pose_landmarks:
            h, w = frame.shape[:2]
            for idx, lm in enumerate(self.results.pose_landmarks.landmark):
                landmarks[idx] = {'x': int(lm.x * w), 'y': int(lm.y * h), 'z': lm.z, 'visibility': lm.visibility}
        return landmarks

    def calculate_angle(self, landmarks, p1_idx, p2_idx, p3_idx):
        try:
            a = np.array([landmarks[p1_idx]['x'], landmarks[p1_idx]['y']])
            b = np.array([landmarks[p2_idx]['x'], landmarks[p2_idx]['y']])
            c = np.array([landmarks[p3_idx]['x'], landmarks[p3_idx]['y']])
            ba = a - b
            bc = c - b
            cosine = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-6)
            return round(np.degrees(np.arccos(np.clip(cosine, -1.0, 1.0))), 2)
        except:
            return None
