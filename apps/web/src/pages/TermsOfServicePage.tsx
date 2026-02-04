import { useEffect } from "react";

export default function TermsOfServicePage() {
    useEffect(() => {
        window.scrollTo(0, 0);

        // Load Termly embed script if not already loaded
        if (!document.getElementById("termly-jssdk")) {
            const script = document.createElement("script");
            script.id = "termly-jssdk";
            script.src = "https://app.termly.io/embed-policy.min.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-mono font-black uppercase tracking-tighter">
                        Términos y <span className="text-accent">Condiciones</span>
                    </h1>
                </header>

                {/* Termly Embed Container */}
                <div
                    className="bg-white rounded-lg p-6 md:p-8 prose prose-sm max-w-none"
                    style={{ minHeight: "500px" }}
                    dangerouslySetInnerHTML={{
                        __html: '<div name="termly-embed" data-id="d56417a9-89cd-4e89-9813-8d13c240ddbb"></div>'
                    }}
                />
            </div>
        </div>
    );
}
