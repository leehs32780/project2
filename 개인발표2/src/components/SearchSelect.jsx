import { t } from "../i18n/translate.js";
import { useEffect, useRef, useState } from "react";

// 국가별 공항 목록과 여행 유형 선택에 공통으로 사용하는 드롭다운입니다.
export default function SearchSelect({
  value,
  options,
  placeholder,
  ariaLabel,
  disabled = false,
  onChange,
}) {
  // 선택창의 열림 상태와 바깥 클릭을 판별할 DOM 요소를 관리합니다.
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  // 그룹 목록을 펼쳐 현재 선택값에 해당하는 표시 문구를 찾습니다.
  const flatOptions = options.flatMap((group) => group.items);
  const selected = flatOptions.find((item) => item.value === value);

  // 열려 있는 동안 바깥 클릭·Escape 키를 감지하고, 닫히거나 제거되면 이벤트를 해제합니다.
  useEffect(() => {
    if (!isOpen) return undefined;
    const close = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [isOpen]);

  return (
    <div className="search-select" ref={rootRef}>
      {/* 현재 선택값을 보여주며 클릭할 때 선택 목록을 열거나 닫습니다. */}
      <button
        className="search-select-trigger"
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={selected ? "" : "is-placeholder"}>{t(selected?.label ?? placeholder)}</span>
        <i aria-hidden="true">▾</i>
      </button>
      {/* 열린 상태에서만 그룹별 선택 항목을 표시하고 선택값을 부모에게 전달합니다. */}
      {isOpen && (
        <div className="search-select-popup" role="listbox">
          {options.map((group) => (
            <div className="search-select-group" key={group.label}>
              {options.length > 1 && <small>{t(group.label)}</small>}
              {group.items.map((item) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={item.value === value}
                  className={item.value === value ? "is-selected" : ""}
                  disabled={item.disabled}
                  key={item.value}
                  onClick={() => {
                    onChange(item.value);
                    setIsOpen(false);
                  }}
                >
                  {t(item.label)}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
