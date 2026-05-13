import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { plants } from "@/data/plants";
import { Button } from "@/components/ui/button";

const bookLinks: Record<string, { name: string; link: string }> = {
  Giloy: {
    name: "Medicinal Plants of India",
    link: "https://books.google.com/",
  },

  Amla: {
    name: "Ayurvedic Healing",
    link: "https://books.google.com/",
  },

  Turmeric: {
    name: "Healing Spices",
    link: "https://books.google.com/",
  },

  Neem: {
    name: "Neem: Nature’s Healing Gift",
    link: "https://books.google.com/",
  },

  Tulsi: {
    name: "Holy Basil Guide",
    link: "https://books.google.com/",
  },

  Mint: {
    name: "Herbal Remedies Handbook",
    link: "https://books.google.com/",
  },

  "Aloe Vera": {
    name: "Aloe Vera Healing",
    link: "https://books.google.com/",
  },

  Brahmi: {
    name: "Ayurveda and Brain Health",
    link: "https://books.google.com/",
  },

  Ashwagandha: {
    name: "Adaptogenic Herbs",
    link: "https://books.google.com/",
  },

  Moringa: {
    name: "The Miracle Tree",
    link: "https://books.google.com/",
  },

  "Holy Basil": {
    name: "Holy Basil Medicinal Guide",
    link: "https://books.google.com/",
  },
};

const VirtualTour = () => {
  const { plantId } = useParams();
  const navigate = useNavigate();

  const [reminder, setReminder] = useState("");
  const [time, setTime] = useState("");
  const [savedReminders, setSavedReminders] = useState<any[]>([]);

  const plant = plants.find(
    (p) => p.id === Number(plantId)
  );

  /* LOAD SAVED REMINDERS */
  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("herbal_reminders") || "[]"
    );

    setSavedReminders(
      stored.filter(
        (item: any) => item.plantId === Number(plantId)
      )
    );
  }, [plantId]);

  /* ASK NOTIFICATION PERMISSION */
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  /* CHECK REMINDER TIME */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      const currentTime =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      savedReminders.forEach((item) => {
        if (item.time === currentTime) {

          if (Notification.permission === "granted") {
            new Notification("🌿 Herbal Reminder", {
              body: `Time for: ${item.reminder}`,
            });
          }
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [savedReminders]);

  /* DELETE REMINDER */
  const deleteReminder = (indexToDelete: number) => {
    const existing = JSON.parse(
      localStorage.getItem("herbal_reminders") || "[]"
    );

    const updated = existing.filter(
      (_: any, index: number) => index !== indexToDelete
    );

    localStorage.setItem(
      "herbal_reminders",
      JSON.stringify(updated)
    );

    setSavedReminders(
      updated.filter(
        (item: any) => item.plantId === Number(plantId)
      )
    );
  };

  /* SAVE REMINDER */
  const saveReminder = () => {
    if (!reminder || !time) return;

    const newReminder = {
      plantId: Number(plantId),
      plantName: plant?.name,
      reminder,
      time,
    };

    const existing = JSON.parse(
      localStorage.getItem("herbal_reminders") || "[]"
    );

    const updated = [...existing, newReminder];

    localStorage.setItem(
      "herbal_reminders",
      JSON.stringify(updated)
    );

    setSavedReminders(
      updated.filter(
        (item: any) => item.plantId === Number(plantId)
      )
    );

    setReminder("");
    setTime("");
  };

  if (!plant) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl">
        Plant not found
      </div>
    );
  }

  const book = bookLinks[plant.name];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: "#ABC8A2",
      }}
    >
<div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 md:p-7">

        {/* IMAGE */}
        <img
          src={plant.image}
          alt={plant.name}
        className="w-full h-56 object-cover rounded-2xl mb-5"
        />

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center mb-3 text-green-900">
          {plant.name}
        </h1>

        {/* DESCRIPTION */}
        <p className="text-gray-700 text-lg leading-8 text-center mb-8">
          {plant.description}
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col gap-4">

          {/* REMINDER SECTION */}
          <div className="bg-green-50 rounded-2xl p-5 border">
            <h2 className="text-2xl font-semibold mb-4 text-green-900">
              Herbal Reminder
            </h2>

            <input
              type="text"
              placeholder="e.g. Drink Tulsi Tea"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 mb-4"
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 mb-4"
            />

            <Button
              className="w-full bg-green-700 hover:bg-green-800"
              onClick={saveReminder}
            >
              Save Reminder
            </Button>
          </div>

          {/* SAVED REMINDERS */}
          {savedReminders.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-5 border">
              <h2 className="text-2xl font-semibold mb-4 text-green-900">
                Saved Reminders
              </h2>

              <div className="space-y-3">
                {savedReminders.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">
                        🌿 {item.reminder}
                      </p>

                      <p className="text-gray-600">
                        ⏰ {item.time}
                      </p>
                    </div>

                    <Button
                      variant="destructive"
                      onClick={() => deleteReminder(index)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOOK BUTTON */}
          {book && (
            <Button
              variant="outline"
              className="py-6 text-lg"
              onClick={() =>
                window.open(book.link, "_blank")
              }
            >
              📚 {book.name}
            </Button>
          )}

          {/* BACK BUTTON */}
          <Button
            variant="secondary"
            className="py-6 text-lg"
            onClick={() => navigate("/bookmarks")}
          >
            ← Back to Bookmarks
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VirtualTour;