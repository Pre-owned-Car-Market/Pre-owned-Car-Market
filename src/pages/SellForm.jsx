import { useState } from "react";

const REGIONS = [
  "서울","부산","대구","인천","광주","대전","울산",
  "경기","강원","충북","충남","전북","전남","경북","경남","제주",
];

export default function SellForm() {
  const [form, setForm] = useState({
    carNumber: "",
    phone: "",
    region: "",
    mileage: "",
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "mileage") {
      const onlyNum = value.replace(/[^\d]/g, "");
      setForm((s) => ({ ...s, [name]: onlyNum }));
    } else {
      setForm((s) => ({ ...s, [name]: value }));
    }
  };

  const validate = () => {
    if (!form.carNumber.trim()) return "차량번호를 입력해 주세요.";
    if (!/^\d{2,3}[가-힣]\d{4}$/.test(form.carNumber.trim()))
      return "차량번호 형식이 올바르지 않습니다. 예) 12가3456";
    if (!form.phone || form.phone.length < 10)
      return "연락처(숫자만)를 정확히 입력해 주세요.";
    if (!form.region) return "지역을 선택해 주세요.";
    if (!form.mileage) return "운행거리를 입력해 주세요.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) { setError(msg); return; }
    setError("");
    setLoading(true);
    setSubmitted(false);

    try {
      // ✅ Nginx/Vite 프록시 덕분에 같은 오리진으로 호출
      const resp = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await resp.json();
      if (!resp.ok || !data?.ok) {
        throw new Error(data?.error || "전송에 실패했습니다.");
      }

      setSubmitted(true);
      // 성공 시 입력값 초기화(원하면 유지)
      setForm({ carNumber: "", phone: "", region: "", mileage: "" });
    } catch (err) {
      setError(err.message || "전송 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.wrap}>
      <section style={styles.headerCard}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={styles.dot} />
          <h2 style={styles.subTitle}>빠른 중고차 판매</h2>
        </div>
        <p style={styles.green}>● 10분 내 응답(근무시간)</p>
      </section>

      <h1 style={styles.title}>중고차 빠른 판매 등록</h1>
      <p style={styles.desc}>
        차량번호·연락처·지역·운행거리만 입력하세요. 전송 즉시 관리자가 알림을 받습니다.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={styles.label}>
          차량번호 <span style={styles.hint}>(예: 12가3456)</span>
          <input
            name="carNumber"
            value={form.carNumber}
            onChange={handleChange}
            placeholder="차량번호를 입력하세요"
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          연락처 <span style={styles.hint}>(휴대폰 번호, 숫자만)</span>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="01012345678"
            inputMode="numeric"
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          지역
          <select
            name="region"
            value={form.region}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">지역을 선택하세요</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          운행거리 (km)
          <input
            name="mileage"
            value={form.mileage}
            onChange={handleChange}
            placeholder="예: 120000"
            inputMode="numeric"
            style={styles.input}
          />
        </label>

        {error && <div style={styles.errorBox}>{error}</div>}
        {submitted && (
          <div style={styles.successBox}>
            전송이 완료되었습니다! 담당자가 곧 연락드립니다.
          </div>
        )}

        <button type="submit" style={styles.primaryBtn} disabled={loading}>
          {loading ? "전송 중..." : "전송하기 — 빠른 견적 요청"}
        </button>

        <p style={styles.footNote}>
          입력하신 정보는 판매 알선 목적 외에 사용되지 않습니다.
        </p>
      </form>
    </main>
  );
}

const styles = {
  wrap: {
    maxWidth: 640,
    margin: "32px auto",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 6px 20px rgba(0,0,0,.06)",
    padding: 20,
    border: "1px solid #eef2f7",
  },
  headerCard: { display: "flex", alignItems: "center", gap: 12, marginBottom: 8 },
  dot: { width: 14, height: 14, borderRadius: 999, background: "#3b82f6", display: "inline-block" },
  subTitle: { fontSize: 16, fontWeight: 600 },
  green: { color: "#16a34a", fontSize: 12 },
  title: { fontSize: 24, fontWeight: 800, margin: "6px 0 8px" },
  desc: { color: "#475569", fontSize: 14, marginBottom: 12 },
  label: { display: "grid", gap: 6, fontSize: 14, color: "#374151" },
  hint: { fontSize: 12, color: "#6b7280", marginLeft: 6 },
  input: {
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "10px 12px",
    outline: "none",
    fontSize: 15,
  },
  primaryBtn: {
    marginTop: 6,
    background: "#1d4ed8",
    color: "#fff",
    border: "none",
    padding: "12px 14px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  errorBox: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 13,
  },
successBox: {
  background: "#ecfeff",
  color: "#155e75",
  border: "1px solid #a5f3fc",
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 13,
},
  footNote: { color: "#6b7280", fontSize: 12, textAlign: "center", marginTop: 8 },
};
