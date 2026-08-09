import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OauthCallback() {
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [provider, setProvider] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const scope = params.get("scope") || "";
    const error = params.get("error");

    setProvider(state || "");

    if (error) {
      setErrorMessage(`OAuth error: ${error}`);
      setStatus("error");
      return;
    }

    if (!code) {
      setErrorMessage("No authorization code received.");
      setStatus("error");
      return;
    }

    const exchange = async () => {
      try {
        const response = await base44.functions.invoke("socialOAuth", {
          provider: "google",
          state,
          code,
          scope,
        });

        if (response.data?.error) {
          setErrorMessage(response.data.error);
          setStatus("error");
          return;
        }

        setStatus("success");
        setTimeout(() => {
          window.location.href = createPageUrl("AdminDashboard") + `?connected=${state}`;
        }, 1200);
      } catch (err) {
        setErrorMessage(err?.response?.data?.error || err.message || "Unknown error");
        setStatus("error");
      }
    };

    exchange();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-10 max-w-md w-full text-center space-y-4">
        {status === "loading" && (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-800">Connecting your account…</h2>
            <p className="text-gray-500 text-sm">Please wait while we complete the connection.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-800">Connected!</h2>
            <p className="text-gray-500 text-sm">Redirecting you to the dashboard…</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-800">Connection Failed</h2>
            {provider && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Provider / State:</span> {provider}
              </p>
            )}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-left">
              <p className="text-red-700 text-sm font-mono break-words">{errorMessage}</p>
            </div>
          </>
        )}

        <a href={createPageUrl("AdminDashboard")}>
          <Button variant="outline" className="mt-4 w-full">
            ← Back to Dashboard
          </Button>
        </a>
      </div>
    </div>
  );
}