import React, { useState, useEffect } from "react";
import { loadVault, saveVault } from "../utils/storage";
import { encryptVault, decryptVault } from "../utils/CryptoService";
import { verifyVault, writeVaultHash } from "../utils/web3Service";
import Toast from './Toast';



export default function Login({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [vaultExists, setVaultExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Initializing...");
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error"); // Add toast type state
  const [btnState, setBtnState] = useState("base");

  const showToast = (msg, type = "error") => { // Accept type parameter
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    async function init() {
      try {
        const vault = await loadVault();
        setVaultExists(!!vault);
        setStatus(vault ? "Welcome back!" : "Create your first vault");
      } catch (err) {
        console.error(err);
        setStatus("Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleCreateVault = async () => {
    if (!password || password.length < 8) {
      showToast("Password needs 8+ characters", "warning");
      return;
    }
    setProcessing(true);
    setStatus("Setting things up...");
    try {
      const emptyVault = { accounts: [] };
      const encrypted = await encryptVault(emptyVault, password);
      await saveVault(encrypted);
      setStatus("Saving to blockchain...");
      await writeVaultHash(encrypted);
      setStatus("All set! ✨");
      showToast("Vault created successfully!", "success");
      setTimeout(() => onUnlock(emptyVault, password), 1000);
    } catch (err) {
      showToast("Creation failed: " + err.message, "error");
      setStatus("Create Master Password");
    } finally {
      setProcessing(false);
    }
  };

  const handleUnlock = async () => {
    if (!password || password.length < 8) {
      showToast("Password needs 8+ characters", "warning");
      return;
    }
    setProcessing(true);
    setStatus("Verifying...");
    try {
      const encryptedVault = await loadVault();
      if (!encryptedVault) {
        showToast("No vault found", "error");
        setProcessing(false);
        return;
      }
      const verified = await verifyVault(encryptedVault);
      if (!verified) {
        showToast("Integrity check failed", "error");
        setProcessing(false);
        return;
      }
      setStatus("Unlocking...");
      const decrypted = await decryptVault(encryptedVault, password);
      showToast("Vault unlocked!", "success");
      setTimeout(() => onUnlock(decrypted, password), 800);
    } catch (err) {
      showToast("Wrong password", "error");
      setPassword("");
      setStatus("Unlock your Vault");
    } finally {
      setProcessing(false);
    }
  };

  const handleAuth = () => {
    if (vaultExists) {
      handleUnlock();
    } else {
      handleCreateVault();
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      
      <div style={styles.bgEffects}>
        <div style={styles.colorBlur}></div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>{vaultExists ? "Welcome back!" : "New Vault"}</h1>
        <p style={styles.status}>{status}</p>
        
        <div style={styles.inputWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="master password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !processing && handleAuth()}
            disabled={processing}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            {showPassword ? '👁️' : '🙈'}
          </button>
        </div>

        <div style={styles.strengthBar}>
          <div style={{
            ...styles.strengthFill,
            width: `${Math.min((password.length / 8) * 100, 100)}%`,
            background: password.length >= 8 ? '#10b981' : '#334155'
          }}></div>
        </div>

        <button
          onClick={handleAuth}
          disabled={processing || password.length < 8}
          style={{
            ...cyberButtonBase,
            ...(btnState === 'hover' ? cyberButtonHover : {}),
            ...(btnState === 'active' ? cyberButtonActive : {}),
            ...(processing || password.length < 8? {
        opacity: 0.5,
        cursor: 'not-allowed',
        boxShadow: 'none',
        filter: 'grayscale(0.3)',
      }
    : {}),
}}
onMouseEnter={() => setBtnState('hover')}
      onMouseLeave={() => setBtnState('base')}
      onMouseDown={() => setBtnState('active')}
      onMouseUp={() => setBtnState('hover')}
    >
      unlock
    </button>
  

        {!processing && (
          <button
            onClick={() => {
              setVaultExists((prev) => !prev);
              setStatus(!vaultExists ? "Unlock your Vault" : "Create Master Password");
              setPassword("");
            }}
            style={styles.toggleButton}
          >
            {vaultExists ? "Don't have one? Create an account!" : "Already have one? Switch to the Existing Vault!"}
          </button>
        )}
      </div>

      {toastMessage && <Toast message={toastMessage} type={toastType} />}
    </div>
  );
}

const keyframes = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulseSoft {
  0%, 100% { opacity: 0.12; }
  50% { opacity: 0.22; }
}

@keyframes lift {
  0% { transform: translateY(0); }
  100% { transform: translateY(-2px); }
}
`;

const styles = {
  container: {
    width: '360px',
    minHeight: '520px',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#020617',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    boxSizing: 'border-box',
    fontFamily:
       "'JetBrains Mono', monospace",
  },

content: {
  position: 'relative',
  zIndex: 2,
  width: '100%',
  padding: '28px 22px',
  borderRadius: '22px',
  background:
    'linear-gradient(180deg, rgba(15,23,42,0.75), rgba(2,6,23,0.85))',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  boxShadow:
    '0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.04)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '14px'
},

title: {
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 28,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#e5e7eb',
  textAlign: 'center',
  margin: 0,
  textShadow:
    '0 0 12px rgba(6, 182, 212, 0.35), 0 0 24px rgba(6, 182, 212, 0.15)'
},

status: {
    fontFamily:  "'JetBrains Mono', monospace",  
    fontSize: '13px',
    fontWeight: 400,
    color: '#94a3b8',
    letterSpacing: '0.04em',
    marginTop: '6px',
    textAlign: 'center',
    marginBottom: '10px'
  },

  inputWrapper: {
  position: 'relative',
  width: '100%',
  maxWidth: '280px',   // ✅ ADD THIS
  margin: '0 auto'     // ✅ CENTER IT
},


  input: {
    width: '100%',
    padding: '14px 52px 14px 18px',
    boxSizing: 'border-box',
    borderRadius: '14px',
    backgroundColor: 'rgba(2,6,23,0.65)',
    border: '1px solid rgba(255,255,255,0.06)',
    color: '#f8fafc',
    fontSize: '14px',
    fontWeight: 400,
    outline: 'none',
    letterSpacing: '0.01em',
    transition: 'border 0.2s ease, background 0.2s ease'
  },

 eyeButton: {
  position: 'absolute',
  right: '18px', // ✅ pull inward
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  color: '#94a3b8'
},


  strengthBar: {
    height: '4px',
    width: '100%',
    borderRadius: '999px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden'
  },

  strengthFill: {
    height: '100%',
    borderRadius: '999px',
    transition: 'width 0.4s ease',
    background:
      'linear-gradient(90deg, #22d3ee, #10b981)'
  },

  button: {
    width: '100%',
    padding: '14px',
    marginTop: '6px',
    borderRadius: '16px',
    border: 'none',
    background:
      'linear-gradient(135deg, #22d3ee, #10b981)',
    color: '#020617',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.02em',
    boxShadow:
      '0 20px 40px rgba(16,185,129,0.35)',
    transition:
      'transform 0.15s ease, box-shadow 0.15s ease'
  },

  toggleButton: {
    fontSize: '13px',
    fontWeight: 400,
    color: '#94a3b8',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginTop: '8px',
    opacity: 0.9
  },

  spinner: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    border: '3px solid rgba(255,255,255,0.1)',
    borderTop: '3px solid #22d3ee',
    animation: 'spin 0.9s linear infinite'
  }
};

const cyberButtonBase = {
  fontFamily: "'JetBrains Mono', monospace",
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  transition: 'transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease',
  width: '100%',
  padding: '16px 24px',
  borderRadius: '14px',
  border: 'none',
  background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
  color: '#020617',
  cursor: 'pointer',
  userSelect: 'none',
  boxShadow: '0 8px 20px -10px rgba(6, 182, 212, 0.35)'

};

const cyberButtonHover = {
  transform: 'translateY(-2px)',
  filter: 'brightness(1.1)',
  boxShadow:
    '0 0 0 2px rgba(6, 182, 212, 0.45), 0 24px 48px -10px rgba(6, 182, 212, 0.75)',
};


const cyberButtonActive = {
  transform: 'translateY(0)',
  boxShadow: '0 0 0 1px rgba(6, 182, 212, 0.2)'
};




