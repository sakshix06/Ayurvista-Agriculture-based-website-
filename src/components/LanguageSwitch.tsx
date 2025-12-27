import { useI18n, type LanguageCode } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";

const LanguageSwitch = () => {
  const { lang, toggleLanguage, t } = useI18n();

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={toggleLanguage}>
        {lang === "en" ? t("lang.hindi") : t("lang.english")}
      </Button>
    </div>
  );
};

export default LanguageSwitch;


