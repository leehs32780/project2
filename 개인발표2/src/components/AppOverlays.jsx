import { t } from "../i18n/translate.js";
import { formatPaymentDiscount } from "../i18n/locale.js";
import { FlightSegments } from "./MultiCityResults";
import { calculatePayment, getPaymentPromotion } from "../data/paymentPromotions";

// App에서 관리하는 상태와 이벤트 함수를 받아 모든 팝업·모달 화면을 렌더링합니다.
export default function AppOverlays({ ui }) {
  // ui 객체를 구조 분해해 각 모달에서 필요한 값과 변경 함수를 바로 사용합니다.
  const {
    loginOpen,
    setLoginOpen,
    loginForm,
    setLoginForm,
    loginError,
    setLoginError,
    authMode,
    setAuthMode,
    signupForm,
    setSignupForm,
    signupError,
    setSignupError,
    signup,
    login,
    findIdName,
    setFindIdName,
    resetForm,
    setResetForm,
    recoveryMessage,
    setRecoveryMessage,
    findId,
    resetPassword,
    loginSuccess,
    setLoginSuccess,
    user,
    profileOpen,
    setProfileOpen,
    profileForm,
    setProfileForm,
    profileAvatars,
    profileAvatarGroups,
    saveProfile,
    savedCards,
    editingCardId,
    sitePaymentPin,
    sitePinForm,
    setSitePinForm,
    cardForm,
    setCardForm,
    savePaymentMethod,
    editPaymentMethod,
    cancelPaymentEdit,
    saveSitePaymentPin,
    removePaymentMethod,
    deleteAccount,
    qnaOpen,
    setQnaOpen,
    qnaForm,
    setQnaForm,
    submitQuestion,
    questionNotice,
    qnaTab,
    setQnaTab,
    visibleQuestions,
    myQuestions,
    currentOwnerId,
    deleteQuestion,
    selectedFlight,
    setSelectedFlight,
    searchedTrip,
    selectedOutbound,
    formatPrice,
    bookingForm,
    setBookingForm,
    requestPaymentPin,
    paymentForm,
    setPaymentForm,
    paymentPinOpen,
    setPaymentPinOpen,
    paymentPin,
    setPaymentPin,
    reserveFlight,
    bookingComplete,
    setBookingComplete,
  } = ui;

  const paymentQuote = calculatePayment(
    (selectedOutbound?.price ?? 0) + (selectedFlight?.price ?? 0),
    paymentForm.method,
  );

  // 각 화면은 해당 open 상태가 true일 때만 DOM에 생성됩니다.
  return (
    <>
      {/* 8-2. 로그인 입력 팝업 */}
      {loginOpen && (
        <div
          className="login-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLoginOpen(false);
          }}
        >
          <section
            className="login-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
          >
            <button
              className="login-close"
              type="button"
              aria-label={t("로그인 창 닫기")}
              onClick={() => setLoginOpen(false)}
            >
              ×
            </button>
            <span className="login-symbol" aria-hidden="true">
              ✈
            </span>
            <p>
              {t(authMode === "signup"
                ? "JOIN SKY ROUTE"
                : authMode === "login"
                  ? "WELCOME BACK"
                  : "ACCOUNT RECOVERY")}
            </p>
            <h2 id="login-title">
              {t(authMode === "signup"
                ? "SKY ROUTE 회원가입"
                : authMode === "find-id"
                  ? "아이디 찾기"
                  : authMode === "reset-password"
                    ? "비밀번호 재설정"
                    : "SKY ROUTE 로그인")}
            </h2>
            {/* 로그인·회원가입 탭을 표시하고 탭 변경 시 입력 오류 안내를 초기화합니다. */}
            {(authMode === "login" || authMode === "signup") && (
              <div className="auth-tabs">
                <button
                  className={authMode === "login" ? "is-active" : ""}
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setSignupError("");
                  }}
                >{t("로그인")}</button>
                <button
                  className={authMode === "signup" ? "is-active" : ""}
                  type="button"
                  onClick={() => {
                    setAuthMode("signup");
                    setLoginError("");
                  }}
                >{t("회원가입")}</button>
              </div>
            )}
            {/* 아이디·비밀번호 입력과 로그인 제출, 계정 찾기 화면 이동을 담당합니다. */}
            {authMode === "login" && (
              <form onSubmit={login}>
                <label>{t("아이디")}<input
                    type="text"
                    autoFocus
                    autoComplete="username"
                    value={loginForm.id}
                    onChange={(event) => {
                      setLoginForm((current) => ({
                        ...current,
                        id: event.target.value,
                      }));
                      setLoginError("");
                    }}
                    placeholder={t("아이디를 입력해보세요")}
                  />
                </label>
                <label>{t("비밀번호")}<input
                    type="password"
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={(event) => {
                      setLoginForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }));
                      setLoginError("");
                    }}
                    placeholder={t("비밀번호를 입력해보세요")}
                  />
                </label>
                {loginError && (
                  <span
                    className={
                      loginError.startsWith("회원가입")
                        ? "login-info"
                        : "login-error"
                    }
                    role="alert"
                  >
                    {t(loginError)}
                  </span>
                )}
                <button className="login-submit" type="submit">{t("로그인")}</button>
                <div className="account-recovery-links">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("find-id");
                      setRecoveryMessage("");
                    }}
                  >{t("아이디 찾기")}</button>
                  <span aria-hidden="true">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("reset-password");
                      setRecoveryMessage("");
                    }}
                  >{t("비밀번호 재설정")}</button>
                </div>
              </form>
            )}
            {/* 가입 정보와 비밀번호 확인을 입력받아 부모의 회원가입 함수로 전달합니다. */}
            {authMode === "signup" && (
              <form onSubmit={signup}>
                <label>{t("아이디")}<input
                    type="text"
                    autoFocus
                    value={signupForm.id}
                    onChange={(event) => {
                      setSignupForm((current) => ({
                        ...current,
                        id: event.target.value,
                      }));
                      setSignupError("");
                    }}
                    placeholder={t("사용할 아이디")}
                    required
                  />
                </label>
                <label>{t("이름")}<input
                    type="text"
                    maxLength="12"
                    value={signupForm.name}
                    onChange={(event) =>
                      setSignupForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder={t("프로필에 표시할 이름")}
                    required
                  />
                </label>
                <label>{t("생년월일")}<input
                    type="text"
                    inputMode="numeric"
                    maxLength="10"
                    value={signupForm.birthDate}
                    onChange={(event) => {
                      const digits = event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 8);
                      const birthDate = [
                        digits.slice(0, 4),
                        digits.slice(4, 6),
                        digits.slice(6, 8),
                      ]
                        .filter(Boolean)
                        .join("-");
                      setSignupForm((current) => ({ ...current, birthDate }));
                      setSignupError("");
                    }}
                    placeholder={t("예: 1999-01-01")}
                    autoComplete="bday"
                    required
                  />
                </label>
                <label>{t("비밀번호")}<input
                    type="password"
                    value={signupForm.password}
                    onChange={(event) => {
                      setSignupForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }));
                      setSignupError("");
                    }}
                    placeholder={t("4자리 이상")}
                    required
                  />
                </label>
                <label>{t("비밀번호 확인")}<input
                    type="password"
                    value={signupForm.confirmPassword}
                    onChange={(event) => {
                      setSignupForm((current) => ({
                        ...current,
                        confirmPassword: event.target.value,
                      }));
                      setSignupError("");
                    }}
                    placeholder={t("비밀번호를 다시 입력해보세요")}
                    required
                  />
                </label>
                {signupError && (
                  <span className="login-error" role="alert">
                    {t(signupError)}
                  </span>
                )}
                <button className="login-submit" type="submit">{t("회원가입 완료")}</button>
              </form>
            )}
            {/* 가입자 이름으로 아이디를 조회하고 조회 결과를 표시합니다. */}
            {authMode === "find-id" && (
              <form onSubmit={findId}>
                <label>{t("가입할 때 입력한 이름")}<input
                    type="text"
                    autoFocus
                    value={findIdName}
                    onChange={(event) => {
                      setFindIdName(event.target.value);
                      setRecoveryMessage("");
                    }}
                    placeholder={t("이름을 입력해보세요")}
                    required
                  />
                </label>
                {recoveryMessage && (
                  <span
                    className={
                      recoveryMessage.startsWith("가입한")
                        ? "login-info"
                        : "login-error"
                    }
                    role="alert"
                  >
                    {t(recoveryMessage)}
                  </span>
                )}
                <button className="login-submit" type="submit">{t("아이디 확인")}</button>
                <button
                  className="recovery-back"
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setRecoveryMessage("");
                  }}
                >{t("로그인으로 돌아가기")}</button>
              </form>
            )}
            {/* 아이디·이름과 새 비밀번호를 받아 비밀번호 재설정을 요청합니다. */}
            {authMode === "reset-password" && (
              <form onSubmit={resetPassword}>
                <label>{t("아이디")}<input
                    type="text"
                    autoFocus
                    value={resetForm.id}
                    onChange={(event) => {
                      setResetForm((current) => ({
                        ...current,
                        id: event.target.value,
                      }));
                      setRecoveryMessage("");
                    }}
                    placeholder={t("가입한 아이디")}
                    required
                  />
                </label>
                <label>{t("가입할 때 입력한 이름")}<input
                    type="text"
                    value={resetForm.name}
                    onChange={(event) => {
                      setResetForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }));
                      setRecoveryMessage("");
                    }}
                    placeholder={t("가입한 이름")}
                    required
                  />
                </label>
                <label>{t("새 비밀번호")}<input
                    type="password"
                    value={resetForm.password}
                    onChange={(event) => {
                      setResetForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }));
                      setRecoveryMessage("");
                    }}
                    placeholder={t("4자리 이상")}
                    required
                  />
                </label>
                <label>{t("새 비밀번호 확인")}<input
                    type="password"
                    value={resetForm.confirmPassword}
                    onChange={(event) => {
                      setResetForm((current) => ({
                        ...current,
                        confirmPassword: event.target.value,
                      }));
                      setRecoveryMessage("");
                    }}
                    placeholder={t("새 비밀번호를 다시 입력해보세요")}
                    required
                  />
                </label>
                {recoveryMessage && (
                  <span className="login-error" role="alert">
                    {t(recoveryMessage)}
                  </span>
                )}
                <button className="login-submit" type="submit">{t("비밀번호 변경")}</button>
                <button
                  className="recovery-back"
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setRecoveryMessage("");
                  }}
                >{t("로그인으로 돌아가기")}</button>
              </form>
            )}
          </section>
        </div>
      )}

      {/* 8-3. 로그인 성공 안내 팝업 */}
      {loginSuccess && (
        <div
          className="login-backdrop success-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLoginSuccess(false);
          }}
        >
          <section
            className="login-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-success-title"
          >
            <span className="success-check" aria-hidden="true">
              ✓
            </span>
            <h2 id="login-success-title">{t("로그인이 되었습니다")}</h2>
            <p>{user?.name}{t("님, 환영합니다.")}</p>
            <small>{t("빈 여백을 클릭하면 화면으로 돌아갑니다.")}</small>
          </section>
        </div>
      )}

      {/* 8-4. 프로필 이름과 기본 이미지 변경 팝업 */}
      {profileOpen && (
        <div
          className="profile-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setProfileOpen(false);
          }}
        >
          <section
            className="profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-title"
          >
            <button
              className="profile-close"
              type="button"
              aria-label={t("프로필 창 닫기")}
              onClick={() => setProfileOpen(false)}
            >
              ×
            </button>
            <span className="profile-preview" aria-hidden="true">
              {t(profileAvatars.find(({ id }) => id === profileForm.avatar)?.icon)}
            </span>
            <h2 id="profile-title">{t("프로필 설정")}</h2>
            <p>{t("표시할 이름과 프로필 이미지를 선택해보세요.")}</p>
            {/* 프로필 이름과 아바타를 수정하고 저장 요청을 부모에게 전달합니다. */}
            <form onSubmit={saveProfile}>
              <label>{t("프로필 이름")}<input
                  type="text"
                  maxLength="12"
                  value={profileForm.name}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                />
              </label>
              <fieldset>
                <legend>{t("기본 프로필 이미지")}</legend>
                <div className="avatar-groups">
                  {profileAvatarGroups.map((group) => (
                    <section className="avatar-group" key={group.category}>
                      <h3>{t(group.category)}</h3>
                      <div className="avatar-options">
                        {group.avatars.map((avatar) => (
                          <button
                            className={
                              profileForm.avatar === avatar.id
                                ? "is-selected"
                                : ""
                            }
                            type="button"
                            key={avatar.id}
                            onClick={() =>
                              setProfileForm((current) => ({
                                ...current,
                                avatar: avatar.id,
                              }))
                            }
                            aria-label={t(avatar.label)}
                            aria-pressed={profileForm.avatar === avatar.id}
                          >
                            {t(avatar.icon)}
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </fieldset>
              {/* 저장된 카드 목록과 카드 등록·수정·삭제 입력을 묶은 영역입니다. */}
              <section className="profile-payment">
                <div className="profile-payment-heading">
                  <div>
                    <b>{t("결제수단")}</b>
                    <small>{t("여러 장을 등록하고 눌러서 수정할 수 있습니다.")}</small>
                  </div>
                </div>
                <div className="saved-card-list">
                  {savedCards.map((card) => (
                    <div
                      className={`saved-card ${editingCardId === card.id ? "is-editing" : ""}`}
                      key={card.id}
                    >
                      <button
                        type="button"
                        className="saved-card-main"
                        onClick={() => editPaymentMethod(card)}
                      >
                        <span>💳</span>
                        <span>
                          <strong>{card.cardName}</strong>
                          <small>
                            •••• •••• •••• {t(card.lastFour)} · {t(card.expiry)}
                          </small>
                        </span>
                        <i>{t(editingCardId === card.id ? "수정 중" : "변경")}</i>
                      </button>
                      <button
                        type="button"
                        className="saved-card-delete"
                        onClick={() => removePaymentMethod(card.id)}
                      >{t("삭제")}</button>
                    </div>
                  ))}
                </div>
                <div className="card-register-form">
                  <strong className="card-form-title">
                    {t(editingCardId === null ? "새 카드 등록" : "등록 카드 변경")}
                  </strong>
                  <label>{t("카드 이름")}<input
                      value={cardForm.cardName}
                      onChange={(event) =>
                        setCardForm((current) => ({
                          ...current,
                          cardName: event.target.value,
                        }))
                      }
                      placeholder={t("예: 여행용 카드")}
                    />
                  </label>
                  <label>{t("카드번호")}<input
                      inputMode="numeric"
                      value={cardForm.cardNumber}
                      onChange={(event) => {
                        const digits = event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 16);
                        setCardForm((current) => ({
                          ...current,
                          cardNumber: digits.replace(/(.{4})/g, "$1 ").trim(),
                        }));
                      }}
                      placeholder={
                        t(editingCardId === null
                          ? "0000 0000 0000 0000"
                          : "변경할 때만 새 번호 입력")
                      }
                      pattern="[0-9 ]{19}"
                    />
                  </label>
                  <div className="payment-row">
                    <label>{t("유효기간")}<input
                        inputMode="numeric"
                        value={cardForm.expiry}
                        onChange={(event) => {
                          const digits = event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4);
                          setCardForm((current) => ({
                            ...current,
                            expiry:
                              digits.length > 2
                                ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                                : digits,
                          }));
                        }}
                        placeholder="MM/YY"
                        pattern="[0-9]{2}/[0-9]{2}"
                      />
                    </label>
                    <label>
                      CVC
                      <input
                        type="password"
                        inputMode="numeric"
                        value={cardForm.cvc}
                        onChange={(event) =>
                          setCardForm((current) => ({
                            ...current,
                            cvc: event.target.value
                              .replace(/\D/g, "")
                              .slice(0, 3),
                          }))
                        }
                        placeholder="000"
                        pattern="[0-9]{3}"
                      />
                    </label>
                  </div>
                  <div className="card-form-actions">
                    {editingCardId !== null && (
                      <button type="button" onClick={cancelPaymentEdit}>{t("취소")}</button>
                    )}
                    <button
                      type="button"
                      className="card-register-button"
                      onClick={savePaymentMethod}
                    >
                      {t(editingCardId === null ? "카드 추가" : "변경사항 저장")}
                    </button>
                  </div>
                </div>
              </section>
              {/* 현재 PIN과 새 PIN 확인값을 입력받아 결제용 PIN을 등록하거나 변경합니다. */}
              <section className="site-pin-settings">
                <div className="site-pin-heading">
                  <div>
                    <b>{t("SKY ROUTE 결제 PIN")}</b>
                    <small>{t("결제수단과 관계없이 결제 승인에 사용하는 6자리 번호입니다.")}</small>
                  </div>
                  <span>{t(sitePaymentPin ? "설정됨" : "미설정")}</span>
                </div>
                {sitePaymentPin && (
                  <label>{t("현재 PIN")}<input
                      type="password"
                      inputMode="numeric"
                      value={sitePinForm.current}
                      onChange={(event) =>
                        setSitePinForm((current) => ({
                          ...current,
                          current: event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6),
                        }))
                      }
                      placeholder={t("현재 PIN 6자리")}
                      maxLength="6"
                    />
                  </label>
                )}
                <div className="payment-row">
                  <label>
                    {t(sitePaymentPin ? "새 PIN" : "PIN 6자리")}
                    <input
                      type="password"
                      inputMode="numeric"
                      value={sitePinForm.newPin}
                      onChange={(event) =>
                        setSitePinForm((current) => ({
                          ...current,
                          newPin: event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6),
                        }))
                      }
                      placeholder={t("숫자 6자리")}
                      maxLength="6"
                    />
                  </label>
                  <label>{t("PIN 확인")}<input
                      type="password"
                      inputMode="numeric"
                      value={sitePinForm.confirm}
                      onChange={(event) =>
                        setSitePinForm((current) => ({
                          ...current,
                          confirm: event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6),
                        }))
                      }
                      placeholder={t("한 번 더 입력")}
                      maxLength="6"
                    />
                  </label>
                </div>
                <button type="button" onClick={saveSitePaymentPin}>
                  {t(sitePaymentPin ? "PIN 변경" : "PIN 등록")}
                </button>
              </section>
              <button className="profile-save" type="submit">{t("변경사항 저장")}</button>
              <div className="account-danger-zone">
                <div>
                  <strong>{t("계정 탈퇴")}</strong>
                  <small>{t("예약, 질문과 결제수단이 모두 삭제됩니다.")}</small>
                </div>
                <button type="button" onClick={deleteAccount}>{t("탈퇴하기")}</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* 8-5. 질문 작성, 내 질문 확인, 삭제가 가능한 Q & A 화면 */}
      {qnaOpen && (
        <div
          className="qna-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setQnaOpen(false);
          }}
        >
          <section
            className="qna-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="qna-title"
          >
            <button
              className="qna-close"
              type="button"
              aria-label={t("질의응답 창 닫기")}
              onClick={() => setQnaOpen(false)}
            >
              ×
            </button>
            <header className="qna-heading">
              <span>What Can I Help You?</span>
              <h2 id="qna-title">{t("무엇을 도와드릴까요?")}</h2>
              <p>{t("항공권과 서비스에 대해 궁금한 내용을 남겨 주세요.")}</p>
            </header>
            <div className="qna-layout">
              {/* 질문 제목과 내용을 부모 상태에 반영하고 작성한 질문을 제출합니다. */}
              <form className="qna-form" onSubmit={submitQuestion}>
                <h3>{t("새 질문 작성")}</h3>
                <label>{t("제목")}<input
                    type="text"
                    value={qnaForm.title}
                    onChange={(event) =>
                      setQnaForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder={t("질문 제목을 입력해보세요")}
                    required
                  />
                </label>
                <label>{t("질문 내용")}<textarea
                    rows="6"
                    value={qnaForm.content}
                    onChange={(event) =>
                      setQnaForm((current) => ({
                        ...current,
                        content: event.target.value,
                      }))
                    }
                    placeholder={t("궁금한 내용을 자세히 적어 주세요")}
                    required
                  />
                </label>
                <button type="submit">{t("질문 등록")}</button>
                {questionNotice && (
                  <p className="qna-notice" role="status">
                    {t(questionNotice.startsWith("로그인") ? "!" : "✓")}{t(" ")}
                    {t(questionNotice)}
                  </p>
                )}
              </form>
              <div className="qna-list">
                <div className="qna-list-title">
                  <h3>
                    {t(qnaTab === "mine" ? "내가 질문한 목록" : "전체 질문")}
                  </h3>
                  <span>{t(visibleQuestions.length)}{t("개")}</span>
                </div>
                <div className="qna-tabs">
                  <button
                    className={qnaTab === "all" ? "is-active" : ""}
                    type="button"
                    onClick={() => setQnaTab("all")}
                  >{t("전체 질문")}</button>
                  <button
                    className={qnaTab === "mine" ? "is-active" : ""}
                    type="button"
                    onClick={() => setQnaTab("mine")}
                  >{t("내 질문 (")}{t(myQuestions.length)})
                  </button>
                </div>
                {visibleQuestions.length === 0 && (
                  <div className="qna-empty">{t("아직 작성한 질문이 없습니다.")}</div>
                )}
                {visibleQuestions.map((question) => (
                  <article className="qna-item" key={question.id}>
                    <div className="qna-item-head">
                      <span className="qna-status">
                        {t(question.answer ? "답변 완료" : "답변 대기")}
                      </span>
                      {question.ownerId === currentOwnerId && (
                        <button
                          type="button"
                          onClick={() => deleteQuestion(question.id)}
                        >{t("삭제")}</button>
                      )}
                    </div>
                    <h4>Q. {question.ownerId ? question.title : t(question.title)}</h4>
                    <p>{question.ownerId ? question.content : t(question.content)}</p>
                    {question.author && (
                      <small className="qna-author">{t("작성자: ")}{question.author}
                      </small>
                    )}
                    {question.answer && (
                      <div className="qna-answer">
                        <strong>A.</strong>
                        <span>{question.ownerId ? question.answer : t(question.answer)}</span>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 8-6. 선택한 항공편의 탑승객 정보 입력 */}
      {selectedFlight && (
        <div
          className="booking-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedFlight(null);
          }}
        >
          <section
            className="booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
          >
            <button
              className="booking-close"
              type="button"
              aria-label={t("예매 창 닫기")}
              onClick={() => setSelectedFlight(null)}
            >
              ×
            </button>
            <span className="booking-eyebrow">PASSENGER DETAILS</span>
            <h2 id="booking-title">{t("항공권 예매")}</h2>
            <div className="booking-flight-summary">
              <FlightSegments segments={selectedFlight.segments} />
              {selectedOutbound && (
                <>
                  <strong>{t("가는 편 · ")}{t(selectedOutbound.airline.name)}{t(" ")}
                    {t(selectedOutbound.cabinLabel ?? "일반석")} · {t(selectedOutbound.flightNumber)}
                  </strong>
                  <span>
                    {t(searchedTrip.departure)} {t(selectedOutbound.departureTime)} →{t(" ")}
                    {t(searchedTrip.arrival)} {t(selectedOutbound.arrivalTime)}
                    {t(selectedOutbound.arrivalDayOffset > 0 &&
                      ` (+${selectedOutbound.arrivalDayOffset}일)`)}
                  </span>
                </>
              )}
              <strong>
                {t(selectedFlight.segments
                  ? "전체 여정"
                  : selectedOutbound
                    ? "오는 편"
                    : "가는 편")}{t(" ")}
                · {t(selectedFlight.airline.name)} {t(selectedFlight.cabinLabel ?? "일반석")} · {t(selectedFlight.flightNumber)}
              </strong>
              <span>
                {t(selectedOutbound
                  ? searchedTrip.arrival
                  : searchedTrip.departure)}{t(" ")}
                {t(selectedFlight.departureTime)} →{t(" ")}
                {t(selectedOutbound
                  ? searchedTrip.departure
                  : searchedTrip.arrival)}{t(" ")}
                {t(selectedFlight.arrivalTime)}
                {t(selectedFlight.arrivalDayOffset > 0 &&
                  ` (+${selectedFlight.arrivalDayOffset}일)`)}
              </span>
              <b>{t("총")}{t(" ")}
                {t(formatPrice(
                  (selectedOutbound?.price ?? 0) + selectedFlight.price,
                ))}
              </b>
            </div>
            {/* 탑승객 정보와 결제수단·동의를 입력한 뒤 PIN 확인 단계로 이동합니다. */}
            <form onSubmit={requestPaymentPin}>
              <label>{t("탑승객 이름")}<input
                  type="text"
                  value={bookingForm.passengerName}
                  onChange={(event) =>
                    setBookingForm((current) => ({
                      ...current,
                      passengerName: event.target.value,
                    }))
                  }
                  placeholder={t("신분증과 동일한 이름")}
                  required
                />
              </label>
              <label>{t("휴대전화")}<input
                  type="tel"
                  value={bookingForm.phone}
                  onChange={(event) =>
                    setBookingForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="010-0000-0000"
                  required
                />
              </label>
              <label>{t("이메일")}<input
                  type="email"
                  value={bookingForm.email}
                  onChange={(event) =>
                    setBookingForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder={t("예약 확인서를 받을 이메일")}
                  required
                />
              </label>
              <div className="payment-section">
                <div className="payment-heading">
                  <span>PAYMENT</span>
                  <strong>{t("결제 방법 선택")}</strong>
                </div>
                <div className="payment-methods">
                  {[
                    { id: "kakao", icon: "K", name: "카카오페이" },
                    { id: "naver", icon: "N", name: "네이버페이" },
                    { id: "toss", icon: "T", name: "토스페이" },
                    { id: "payco", icon: "P", name: "페이코" },
                    ...savedCards.map((card) => ({
                      id: `card:${card.id}`,
                      icon: "💳",
                      name: `${card.cardName} •${card.lastFour}`,
                    })),
                  ].map((method) => (
                    <label
                      className={`payment-method ${paymentForm.method === method.id ? "is-selected" : ""}`}
                      key={method.id}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={method.id}
                        checked={paymentForm.method === method.id}
                        onChange={(event) =>
                          setPaymentForm((current) => ({
                            ...current,
                            method: event.target.value,
                          }))
                        }
                      />
                      <b>{t(method.icon)}</b>
                      <span className="payment-method-copy">
                        <span>{method.id.startsWith("card:") ? method.name : t(method.name)}</span>
                        <em>{t(getPaymentPromotion(method.id)?.label)}</em>
                        <small>{t(getPaymentPromotion(method.id)?.condition)}</small>
                      </span>
                    </label>
                  ))}
                </div>
                <p className="payment-promotion-note">{t("테스트 결제 전용 혜택 · 실제 결제사 행사와 무관 · 중복 할인 불가")}</p>
                <div className="payment-discount-summary" aria-live="polite" aria-atomic="true">
                  <div><span>{t("할인 전 금액")}</span><span>{t(formatPrice(paymentQuote.originalAmount))}</span></div>
                  <div className="payment-discount-line"><span>{t("결제수단 할인")}</span><strong>-{formatPaymentDiscount(paymentQuote)}</strong></div>
                  {paymentQuote.remainingAmount > 0 && <p>{t("할인 적용까지 ")}{t(formatPrice(paymentQuote.remainingAmount))}{t(" 부족합니다.")}</p>}
                  <div className="payment-final-total"><strong>{t("최종 결제 금액")}</strong><strong>{t(formatPrice(paymentQuote.amount))}</strong></div>
                </div>
                <label className="payment-agree">
                  <input
                    type="checkbox"
                    checked={paymentForm.agreed}
                    onChange={(event) =>
                      setPaymentForm((current) => ({
                        ...current,
                        agreed: event.target.checked,
                      }))
                    }
                    required
                  />
                  <span>{t("결제 금액과 예약 정보를 확인했으며 결제 진행에 동의합니다.")}</span>
                </label>
              </div>
              <div className="booking-caution">{t("테스트 결제입니다. 실제 카드 승인이나 금액 청구는 진행되지 않습니다.")}</div>
              <button type="submit">
                {t(formatPrice(paymentQuote.amount))}{t(" ")}{t("결제하기")}</button>
            </form>
          </section>
        </div>
      )}

      {/* 8-7. 결제 PIN 확인 */}
      {paymentPinOpen && (
        <div className="pin-backdrop" role="presentation">
          <section
            className="pin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pin-title"
          >
            <button
              className="pin-close"
              type="button"
              aria-label={t("PIN 입력 창 닫기")}
              onClick={() => setPaymentPinOpen(false)}
            >
              ×
            </button>
            <span className="pin-lock" aria-hidden="true">
              🔒
            </span>
            <p>SECURE PAYMENT</p>
            <h2 id="pin-title">{t("결제 PIN 입력")}</h2>
            <p className="payment-pin-total">{t("최종 결제 금액 ")}<strong>{t(formatPrice(paymentQuote.amount))}</strong></p>
            <small>{t("프로필에 등록한 SKY ROUTE 결제 PIN 6자리를 입력해보세요.")}</small>
            {/* 입력한 PIN 확인과 예약 저장을 부모 함수에 맡깁니다. */}
            <form onSubmit={reserveFlight}>
              <input
                type="password"
                inputMode="numeric"
                autoComplete="off"
                autoFocus
                maxLength="6"
                pattern="[0-9]{6}"
                value={paymentPin}
                onChange={(event) =>
                  setPaymentPin(
                    event.target.value.replace(/\D/g, "").slice(0, 6),
                  )
                }
                aria-label={t("결제 PIN 6자리")}
                placeholder="••••••"
                required
              />
              <div className="pin-dots" aria-hidden="true">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <i
                    className={paymentPin.length > index ? "is-filled" : ""}
                    key={index}
                  ></i>
                ))}
              </div>
              <button type="submit" disabled={paymentPin.length !== 6}>{t("결제 승인")}</button>
            </form>
            <em>{t("카드 등록 시 설정한 숫자 6자리를 입력해보세요.")}</em>
          </section>
        </div>
      )}

      {/* 8-8. 예약 완료번호 안내 */}
      {bookingComplete && (
        <div
          className="booking-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setBookingComplete(null);
          }}
        >
          <section
            className="booking-complete"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-complete-title"
          >
            <span>✓</span>
            <h2 id="booking-complete-title">{t("결제 및 예매가 완료되었습니다")}</h2>
            {/* 저장된 예약의 결제 금액과 선택 수단을 완료 화면에 표시합니다. */}
            <div className="payment-complete-info">
              <b>{t(formatPrice(bookingComplete.payment.amount))}</b>
              {bookingComplete.payment.discountAmount > 0 && (
                <span>{t(bookingComplete.payment.promotionLabel)} · {formatPaymentDiscount(bookingComplete.payment)}{t(" 할인 적용")}</span>
              )}
              <span>
                {bookingComplete.payment.lastFour ? bookingComplete.payment.method : t(bookingComplete.payment.method)}
                {t(bookingComplete.payment.lastFour &&
                  ` · 끝번호 ${bookingComplete.payment.lastFour}`)}{t(" ")}{t("· 결제 완료")}</span>
            </div>
            <p>{t("예약번호")}</p>
            <strong>{t(bookingComplete.number)}</strong>
            <small>
              {bookingComplete.passenger.passengerName} ·{t(" ")}
              {t(bookingComplete.flight.airline.name)}{t(" ")}
              {t(bookingComplete.flight.cabinLabel ?? "일반석")} · {t(bookingComplete.flight.flightNumber)}
            </small>
            <button type="button" onClick={() => setBookingComplete(null)}>{t("확인")}</button>
          </section>
        </div>
      )}
    </>
  );
}
