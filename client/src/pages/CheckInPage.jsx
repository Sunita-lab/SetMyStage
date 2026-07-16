import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CheckCircle2, XCircle, ScanLine } from "lucide-react";
import { checkInAttendee } from "../services/registrationService";

function CheckInPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 }, false);

    const onScanSuccess = async (decodedText) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        const data = await checkInAttendee(decodedText);
        setResult(data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Check-in failed");
        setResult(null);
      }

      setTimeout(() => {
        isProcessingRef.current = false;
        setResult(null);
        setError("");
      }, 3000);
    };

    scanner.render(onScanSuccess, () => {});

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ScanLine className="text-secondary" size={22} />
          <h1 className="font-heading font-bold text-2xl text-ink">Scan to Check In</h1>
        </div>
        <p className="text-mist text-sm mb-8">Point the camera at the attendee's QR code</p>

        <div className="bg-surface rounded-card border border-border shadow-md p-4 mb-6 overflow-hidden">
          <div id="qr-reader" className="rounded-input overflow-hidden" />
        </div>

        {!result && !error && (
          <p className="text-mist text-sm">Ready to scan...</p>
        )}

        {result && (
          <div className="bg-success/10 border border-success rounded-card p-6 animate-scaleIn">
            <CheckCircle2 className="text-success mx-auto mb-2" size={40} />
            <p className="text-success font-heading font-bold text-lg">Checked In</p>
            <p className="text-ink mt-1">{result.attendeeName}</p>
            <p className="text-mist text-sm">{result.eventTitle}</p>
          </div>
        )}

        {error && (
          <div className="bg-danger/10 border border-danger rounded-card p-6 animate-scaleIn">
            <XCircle className="text-danger mx-auto mb-2" size={40} />
            <p className="text-danger font-semibold">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckInPage;