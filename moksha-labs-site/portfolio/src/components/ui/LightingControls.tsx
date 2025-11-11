"use client";

import { useState } from "react";
import { LightingConfig, LightingState } from "@/hooks/useLighting";

interface LightingControlsProps {
  lightingState: LightingState;
  onConfigChange: (config: Partial<LightingConfig>) => void;
}

export default function LightingControls({
  lightingState,
  onConfigChange,
}: LightingControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"colors" | "shadows" | "mist" | "atmosphere">("colors");

  const { config, timeOfDay } = lightingState;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          border: "2px solid rgba(255, 255, 255, 0.3)",
          padding: "12px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
          fontFamily: "monospace",
          zIndex: 10000,
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        💡 Lighting Controls
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        background: "rgba(0, 0, 0, 0.9)",
        color: "white",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "12px",
        padding: "20px",
        maxWidth: "400px",
        maxHeight: "85vh",
        overflowY: "auto",
        fontFamily: "monospace",
        fontSize: "12px",
        zIndex: 10000,
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.8)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          paddingBottom: "15px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", marginBottom: "5px" }}>
            💡 Lighting Controls
          </h3>
          <div style={{ fontSize: "11px", opacity: 0.7 }}>
            Time: {timeOfDay.period} ({Math.round(timeOfDay.periodProgress * 100)}%)
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: "#444",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "5px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {(["colors", "shadows", "mist", "atmosphere"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? "#4CAF50" : "#333",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "11px",
              textTransform: "capitalize",
              transition: "all 0.2s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ marginBottom: "15px" }}>
        {activeTab === "colors" && (
          <div>
            <h4 style={{ marginTop: 0, marginBottom: "15px", fontSize: "14px" }}>
              🎨 Color Settings
            </h4>
            
            <ColorControl
              label="Day Sky"
              value={config.daySkyColor}
              onChange={(val) => onConfigChange({ daySkyColor: val })}
            />
            <ColorControl
              label="Twilight Sky"
              value={config.twilightSkyColor}
              onChange={(val) => onConfigChange({ twilightSkyColor: val })}
            />
            <ColorControl
              label="Dawn Sky"
              value={config.dawnSkyColor}
              onChange={(val) => onConfigChange({ dawnSkyColor: val })}
            />
            <ColorControl
              label="Dusk Sky"
              value={config.duskSkyColor}
              onChange={(val) => onConfigChange({ duskSkyColor: val })}
            />
            <ColorControl
              label="Night Sky"
              value={config.nightSkyColor}
              onChange={(val) => onConfigChange({ nightSkyColor: val })}
            />

            <div style={{ height: "1px", background: "rgba(255,255,255,0.2)", margin: "20px 0" }} />

            <ColorControl
              label="Day Mountain"
              value={config.dayMountainColor}
              onChange={(val) => onConfigChange({ dayMountainColor: val })}
            />
            <ColorControl
              label="Twilight Mountain"
              value={config.twilightMountainColor}
              onChange={(val) => onConfigChange({ twilightMountainColor: val })}
            />
            <ColorControl
              label="Dawn Mountain"
              value={config.dawnMountainColor}
              onChange={(val) => onConfigChange({ dawnMountainColor: val })}
            />
            <ColorControl
              label="Dusk Mountain"
              value={config.duskMountainColor}
              onChange={(val) => onConfigChange({ duskMountainColor: val })}
            />
            <ColorControl
              label="Night Mountain"
              value={config.nightMountainColor}
              onChange={(val) => onConfigChange({ nightMountainColor: val })}
            />

            <div style={{ height: "1px", background: "rgba(255,255,255,0.2)", margin: "20px 0" }} />

            <ColorControl
              label="Day Water"
              value={config.dayWaterColor}
              onChange={(val) => onConfigChange({ dayWaterColor: val })}
            />
            <ColorControl
              label="Twilight Water"
              value={config.twilightWaterColor}
              onChange={(val) => onConfigChange({ twilightWaterColor: val })}
            />
            <ColorControl
              label="Dawn Water"
              value={config.dawnWaterColor}
              onChange={(val) => onConfigChange({ dawnWaterColor: val })}
            />
            <ColorControl
              label="Dusk Water"
              value={config.duskWaterColor}
              onChange={(val) => onConfigChange({ duskWaterColor: val })}
            />
            <ColorControl
              label="Night Water"
              value={config.nightWaterColor}
              onChange={(val) => onConfigChange({ nightWaterColor: val })}
            />
          </div>
        )}

        {activeTab === "shadows" && (
          <div>
            <h4 style={{ marginTop: 0, marginBottom: "15px", fontSize: "14px" }}>
              🌑 Shadow Settings
            </h4>

            <CheckboxControl
              label="Enable Shadows"
              value={config.shadowEnabled}
              onChange={(val) => onConfigChange({ shadowEnabled: val })}
            />

            {config.shadowEnabled && (
              <>
                <SliderControl
                  label="Shadow Opacity"
                  value={config.shadowOpacity}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(val) => onConfigChange({ shadowOpacity: val })}
                />
                <SliderControl
                  label="Shadow Blur"
                  value={config.shadowBlur}
                  min={0}
                  max={100}
                  step={1}
                  onChange={(val) => onConfigChange({ shadowBlur: val })}
                />
                <SliderControl
                  label="Shadow Offset"
                  value={config.shadowOffsetMultiplier}
                  min={0}
                  max={3}
                  step={0.1}
                  onChange={(val) => onConfigChange({ shadowOffsetMultiplier: val })}
                />
              </>
            )}
          </div>
        )}

        {activeTab === "mist" && (
          <div>
            <h4 style={{ marginTop: 0, marginBottom: "15px", fontSize: "14px" }}>
              🌫️ Mist Settings
            </h4>

            <CheckboxControl
              label="Enable Mist"
              value={config.mistEnabled}
              onChange={(val) => onConfigChange({ mistEnabled: val })}
            />

            {config.mistEnabled && (
              <>
                <SliderControl
                  label="Day Mist Opacity"
                  value={config.mistDayOpacity}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(val) => onConfigChange({ mistDayOpacity: val })}
                />
                <SliderControl
                  label="Night Mist Opacity"
                  value={config.mistNightOpacity}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(val) => onConfigChange({ mistNightOpacity: val })}
                />
                <SliderControl
                  label="Mist Layers"
                  value={config.mistLayerCount}
                  min={1}
                  max={10}
                  step={1}
                  onChange={(val) => onConfigChange({ mistLayerCount: val })}
                />
                <SliderControl
                  label="Mist Height"
                  value={config.mistHeight}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(val) => onConfigChange({ mistHeight: val })}
                />
              </>
            )}
          </div>
        )}

        {activeTab === "atmosphere" && (
          <div>
            <h4 style={{ marginTop: 0, marginBottom: "15px", fontSize: "14px" }}>
              ✨ Atmospheric Effects
            </h4>

            <CheckboxControl
              label="Enable God Rays"
              value={config.godRaysEnabled}
              onChange={(val) => onConfigChange({ godRaysEnabled: val })}
            />
            {config.godRaysEnabled && (
              <SliderControl
                label="God Rays Intensity"
                value={config.godRaysIntensity}
                min={0}
                max={1}
                step={0.01}
                onChange={(val) => onConfigChange({ godRaysIntensity: val })}
              />
            )}

            <div style={{ height: "10px" }} />

            <CheckboxControl
              label="Enable Lens Flare"
              value={config.lensFlareEnabled}
              onChange={(val) => onConfigChange({ lensFlareEnabled: val })}
            />
            {config.lensFlareEnabled && (
              <SliderControl
                label="Lens Flare Intensity"
                value={config.lensFlareIntensity}
                min={0}
                max={1}
                step={0.01}
                onChange={(val) => onConfigChange({ lensFlareIntensity: val })}
              />
            )}

            <div style={{ height: "10px" }} />

            <CheckboxControl
              label="Enable Fog"
              value={config.fogEnabled}
              onChange={(val) => onConfigChange({ fogEnabled: val })}
            />
            {config.fogEnabled && (
              <SliderControl
                label="Fog Density"
                value={config.fogDensity}
                min={0}
                max={1}
                step={0.01}
                onChange={(val) => onConfigChange({ fogDensity: val })}
              />
            )}
          </div>
        )}
      </div>

      {/* Export Button */}
      <button
        onClick={() => {
          console.log("=== LIGHTING CONFIGURATION ===");
          console.log(JSON.stringify(config, null, 2));
          alert("Configuration logged to console!");
        }}
        style={{
          width: "100%",
          padding: "12px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "bold",
          marginTop: "10px",
        }}
      >
        📋 Log Config to Console
      </button>
    </div>
  );
}

// Helper components
function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <label style={{ display: "block", marginBottom: "5px", fontSize: "11px" }}>
        {label}: <span style={{ color: "#4CAF50" }}>{value.toFixed(2)}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", cursor: "pointer" }}
      />
    </div>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
      <label style={{ flex: 1, fontSize: "11px" }}>{label}:</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "50px",
          height: "30px",
          cursor: "pointer",
          border: "2px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "4px",
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "80px",
          padding: "5px",
          background: "#333",
          color: "white",
          border: "1px solid #555",
          borderRadius: "4px",
          fontSize: "10px",
          fontFamily: "monospace",
        }}
      />
    </div>
  );
}

function CheckboxControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        style={{ cursor: "pointer", width: "18px", height: "18px" }}
      />
      <label style={{ fontSize: "11px", cursor: "pointer" }} onClick={() => onChange(!value)}>
        {label}
      </label>
    </div>
  );
}

