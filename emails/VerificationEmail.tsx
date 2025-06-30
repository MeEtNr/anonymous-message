import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  username: string;
  otp: string;
  appName?: string;
}

export default function VerificationEmail({
  username,
  otp,
  appName = "anonymous_message",
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your {appName} Verification code</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Hello {username},</Text>
          <Text style={paragraph}>
            Thanks for registering. Please use the following verification code
            to complete your registration :
          </Text>
          <Section style={codeContainer}>
            <Text style={code}>{otp}</Text>
          </Section>
          <Text style={paragraph}>Please don’t share it with anyone.</Text>
          <Text style={paragraph}>
            Thanks,
            <br />
            The {appName} Team
          </Text>
          <Text style={footer}>
            If you didn’t request this, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f4f6f8",
  padding: "20px",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  padding: "30px",
  maxWidth: "600px",
  margin: "0 auto",
};

const heading = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#333",
};

const paragraph = {
  fontSize: "14px",
  color: "#555",
  lineHeight: "1.5",
};

const codeContainer = {
  margin: "20px 0",
  textAlign: "center" as const,
};

const code = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#007BFF",
  letterSpacing: "4px",
};

const footer = {
  fontSize: "12px",
  color: "#999",
  marginTop: "40px",
};
