import { Key } from "lucide-react";
import React from "react";
import Tabs from "../../../../../../components/ui/Tabs";
import PageHeader from "../../../../../components/PageHeader";

// Components
import { PinMethodView } from "./components/MethodViews/PinMethodView";
import { QRMethodView } from "./components/MethodViews/QRMethodView";
import { RFIDMethodView } from "./components/MethodViews/RFIDMethodView";

// Hooks
import { useAccessPage } from "./hooks/useAccessPage";

const AccessPage: React.FC = () => {
  const {
    t,
    activeMethod,
    isFullscreen,
    setIsFullscreen,
    tabs,
    handleTabChange,
    isCheckingIn,
    handlePinComplete,
    handleRfidTap,
    isScannerReady,
    isMirrored,
    setIsMirrored,
    cameraError,
    startScanner,
  } = useAccessPage();

  const renderAccessContent = () => {
    switch (activeMethod) {
      case "qr":
        return (
          <QRMethodView
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
            isScannerReady={isScannerReady}
            cameraError={cameraError}
            isMirrored={isMirrored}
            setIsMirrored={setIsMirrored}
            startScanner={startScanner}
          />
        );
      case "pin":
        return (
          <PinMethodView
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
            onPinComplete={handlePinComplete}
            isLoading={isCheckingIn}
          />
        );
      case "rfid":
        return (
          <RFIDMethodView
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
            onRfidTap={handleRfidTap}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-700 min-h-[calc(100vh-12rem)] flex flex-col ">
      <PageHeader
        title={t("access.title")}
        subtitle={t("access.subtitle")}
        icon={Key}
      />

      <div className="flex-1 flex flex-col">
        <div className="mb-8">
          <Tabs
            tabs={tabs}
            activeTab={activeMethod}
            onChange={handleTabChange}
          />
        </div>

        <div className="flex-1 flex items-center justify-center max-w-4xl mx-auto w-full relative">
          {renderAccessContent()}
        </div>
      </div>

      <style>
        {`
          #qr-reader video {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }
          #qr-reader {
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          @keyframes scan {
            0% { transform: translateY(0); }
            50% { transform: translateY(250px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default AccessPage;
