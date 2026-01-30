import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";

const MEDUSA_BASE_URL = process.env.EXPO_PUBLIC_MEDUSA_URL;
const PUBLISHABLE_API_KEY = process.env.EXPO_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY;

export default function AccountScreen() {
  const [mode, setMode] = useState<"email" | "phone">("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleEmailLogin = () => {
    console.log("Login with email:", email, password);
    // TODO: call backend email login
  };

  const handleSendOtp = async () => {
    try {
      const res = await fetch(
        `${MEDUSA_BASE_URL}/auth/customer/phone-auth`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        },
      );

      if (!res.ok) {
        const error = await res.json();
        console.log("Send OTP Error:", error);
        return;
      }

      setOtpSent(true);
      console.log("OTP sent!");
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(
        `${MEDUSA_BASE_URL}/auth/customer/phone-auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, otp }),
        },
      );

      if (!response.ok) {
        const errData = await response.json();
        console.log("Error verifying OTP:", errData);
        return;
      }

      const data = await response.json();
      console.log("Login successful, JWT token:", data);
      // Save JWT token for future requests
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Login with Google");
    // TODO: integrate Google auth
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>

      {/* Mode Switch */}
      <View style={styles.switchRow}>
        <TouchableOpacity
          style={[styles.switchButton, mode === "email" && styles.activeSwitch]}
          onPress={() => setMode("email")}
        >
          <Text>Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchButton, mode === "phone" && styles.activeSwitch]}
          onPress={() => setMode("phone")}
        >
          <Text>Phone</Text>
        </TouchableOpacity>
      </View>

      {/* EMAIL LOGIN */}
      {mode === "email" && (
        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleEmailLogin}
          >
            <Text style={styles.primaryButtonText}>Login</Text>
          </TouchableOpacity>
        </>
      )}

      {/* PHONE OTP LOGIN */}
      {mode === "phone" && (
        <>
          <TextInput
            placeholder="Phone number (e.g. +2547...)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />

          {otpSent && (
            <TextInput
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              style={styles.input}
            />
          )}

          {!otpSent ? (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSendOtp}
            >
              <Text style={styles.primaryButtonText}>Send OTP</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleVerifyOtp}
            >
              <Text style={styles.primaryButtonText}>Verify OTP</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      {/* GOOGLE LOGIN */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  switchRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  switchButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  activeSwitch: {
    backgroundColor: "#eee",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  orText: {
    marginHorizontal: 8,
    color: "#999",
  },
  googleButton: {
    backgroundColor: "#DB4437",
    padding: 14,
    borderRadius: 8,
  },
  googleButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
