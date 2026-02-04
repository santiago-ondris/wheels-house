import { useEffect } from "react";

export default function PrivacyPolicyPage() {
    useEffect(() => {
        window.scrollTo(0, 0);

        // Load Termly embed script
        const script = document.createElement("script");
        script.src = "https://app.termly.io/embed-policy.min.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup script on unmount
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-mono font-black uppercase tracking-tighter">
                        Política de <span className="text-accent">Privacidad</span>
                    </h1>
                </header>

                {/* Termly Embed Container */}
                <div
                    className="bg-white rounded-lg p-6 md:p-8 prose prose-sm max-w-none"
                    style={{ minHeight: "500px" }}
                    dangerouslySetInnerHTML={{
                        __html: '<div name="termly-embed" data-id="adfcd4a5-f117-4371-9ec7-8886e9663fb0"></div>'
                    }}
                />
            </div>
        </div>
    );
}
