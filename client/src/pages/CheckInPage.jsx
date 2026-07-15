import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { checkInAttendee } from "../services/registrationService";

function CheckInPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const scannerRef = useRef(null);
  const isProcessing = useRef(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    const onScanSuccess = async (decodedText) => {
      // Ek hi QR ko baar-baar process hone se roko jab tak result clear na ho
      if (isProcessing.current) return;
      isProcessing.current = true;

      try {
        const data = await checkInAttendee(decodedText);
        setResult(data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Check-in failed");
        setResult(null);
      }

      // 2 second baad dubara scan allow karo
      setTimeout(() => {
        isProcessing.current = false;
      }, 2000);
    };

    scanner.render(onScanSuccess, () => {});
    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-md mx-auto">
        <h1 className="font-heading font-bold text-2xl text-primary mb-6 text-center">
          Scan Ticket QR Code
        </h1>

        <div id="qr-reader" className="rounded-card overflow-hidden mb-6" />

        {result && (
          <div className="bg-success/10 border border-success rounded-card p-4 text-center">
            <p className="text-success font-semibold">✓ Checked in successfully</p>
            <p className="text-ink mt-1">{result.attendeeName}</p>
            <p className="text-mist text-sm">{result.eventTitle}</p>
          </div>
        )}

        {error && (
          <div className="bg-danger/10 border border-danger rounded-card p-4 text-center">
            <p className="text-danger font-semibold">✗ {error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckInPage;