import { News } from "../model/News";
import { Match } from "../model/Match";
import { Player } from "../Models/Player";
import { GalleryItem } from "../Models/GalleryItem";

export async function seedDataIfEmpty() {
  try {
    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      console.log("Seeding initial news articles...");
      const newsArticles = [
        {
          title: "KHAIRU BOYS TRIUMPH IN COVETED OSUN DERBY; SWEEP PRIME FC 2-1",
          slug: "khairu-boys-triumph-in-coveted-osun-derby-39af1a",
          summary: "In a spectacular show of resilience and tactical command, Dokkal Khairu FC defeated Prime FC at a packed Ife Township Stadium, capturing all three essential points.",
          content: `
            <h2>Strategic Brilliance Leads The Khairu Boys To Victory</h2>
            <p>It was a hot afternoon in Ilé-Ifẹ̀, but the atmosphere inside the Ife Township Stadium was electric. Fans from across Osun State crowded the stands to witness the highly anticipated derby between <strong>Dokkal Khairu FC</strong> (The Khairu Boys) and <strong>Prime FC</strong>.</p>
            <blockquote>"From the crown of Ilé-Ifẹ̀ to every corner of Osun State, we fought for every blade of grass today. This is what pride looks like," said Head Coach during the post-match press conference.</blockquote>
            <p>The match kicked off with high intensity. Dokkal Khairu FC dominated possession from the 10th minute, utilizing creative wing play. The breakthrough came at the 34th minute when midfielder Oluwaseun Adebayo played a perfect lob over the defense, which was clinicaly finished by striker Kolawole Yusuf.</p>
            <p>Prime FC responded early in the second half, capitalizing on a defensive miscommunication to score an equalizer in the 52nd minute. However, the Khairu boys did not waver. Driven by the loud chanting of local supporters and with incredible determination, they pushed forward.</p>
            <p>In the 78th minute, a penalty was awarded to Dokkal Khairu FC after a hand-ball in Prime FC's box. Up stepped young star Adebisi Ibrahim, who calmly slotted the ball into the bottom right corner, sending the home crowd into pure ecstasy. The defence held off intense late pressure from Prime FC until the final whistle to solidify an outstanding 2-1 derby victory.</p>
          `,
          coverImage: {
            url: "/uploads/hero-img.jpg",
            publicId: "seed_news_1"
          },
          category: "Match Report",
          tags: ["Derby Match", "Prime FC", "OSFA League", "Victory"],
          isFeatured: true,
          views: 247
        },
        {
          title: "DOKKAL KHAIRU FC ANNOUNCES PARTNERSHIP WITH OSUN STATE SPORTS DEVELOPMENT COUNCIL",
          slug: "dokkal-khairu-fc-announces-partnership-bc324a",
          summary: "Dokkal Khairu FC has signed a historic five-year technical partnership with the State Sports Development Council to upgrade grassroots soccer facilities across Ilé-Ifẹ̀.",
          content: `
            <h2>A Bold Leap Forward for Grassroots Development</h2>
            <p>Dokkal Khairu FC has officially solidified a groundbreaking alliance with the <strong>Osun State Sports Development Council</strong>. This partnership is designed to establish advanced, elite youth training programs and construct premium, state-of-the-art synthetic multi-sport pitches in our home base of Ilé-Ifẹ̀.</p>
            <p>The deal includes provision of world-class training materials, high-performance physical metrics tracking systems, and direct funding for community outreach centers in Osun State. This will dramatically widen the scout network, giving talented local boys from less privileged backgrounds an elite pathway to professional football careers.</p>
            <blockquote>"This is more than football. We are building a model of sports excellence that honors the deep historical, cultural, and spiritual heritage of Ilé-Ifẹ̀," declared the Club President.</blockquote>
          `,
          coverImage: {
            url: "/uploads/image-1.jpg",
            publicId: "seed_news_2"
          },
          category: "Club News",
          tags: ["Partnership", "Sports Ministry", "Ile-Ife", "Infrastructure"],
          isFeatured: true,
          views: 189
        },
        {
          title: "ACADEMY RECRUITMENT TOUR KICKS OFF NEXT WEEK IN IFE GRAND RESORT",
          slug: "academy-recruitment-tour-kicks-off-de211f",
          summary: "Calling all young talents in Osun State! Dokkal Khairu FC Academy is starting its annual recruitment trials at the Ife Grand Resort Pitch for highly talented players aged 14 to 18.",
          content: `
            <h2>The Journey to Greatness Begins Here</h2>
            <p>Are you a highly talented football player between the ages of 14 and 18 based in Ilé-Ifẹ̀, Osogbo, Ilesa, or surrounding areas of Osun State? This is your golden opportunity to join the prestigious Dokkal Khairu FC Youth Academy!</p>
            <p>Our scouts will be hosting open trial camps at the <strong>Ife Grand Resort Soccer Arena</strong> starting next week. Registration forms are completely free and can be obtained at our administrative headquarters in Ilé-Ifẹ̀ or directly at the gates during trial days.</p>
            <p>Selected players will receive full academic scholarships, access to professional coaching, health and dietary supervision, and direct exposure to national scout directors.</p>
          `,
          coverImage: {
            url: "/uploads/image-2.jpg",
            publicId: "seed_news_3"
          },
          category: "Youth",
          tags: ["Academy", "Trials", "Recruitment", "Youth Development"],
          isFeatured: false,
          views: 110
        },
        {
          title: "EXCLUSIVE INTERVIEW: KOLAWOLE YUSUF ON GOAL-SCORING FORM AND TEAM AMBITION",
          slug: "exclusive-interview-kolawole-yusuf-goal-scoring-ff231e",
          summary: "Following his majestic header in Saturday's local derby, our star striker Kolawole Yusuf shares insights on his physical preparation and our OSFA league aspirations.",
          content: `
            <h2>Hungry For More: Inside Yusuf's Champions Mindset</h2>
            <p>With three goals in his last four matches, striker Kolawole Yusuf is making a name for himself as Osun State's most lethal center-forward. We sat down with him in the dressing room at Ife Grand Resort Arena to learn about his incredible run of form.</p>
            <p>"The work we put in during pre-season is truly showing results. The fitness coach has been pushing us hard, and the synergy with Oluwaseun in midfield is natural. We just know where the other is on the pitch," Yusuf says smiling.</p>
            <p>When asked about league title dreams, Yusuf remained grounded: "We take it game by game. Ilé-Ifẹ̀ is an ancient home of kings, and we want to bring a champion's trophy to this city. But that requires hard work every single minute of training."</p>
          `,
          coverImage: {
            url: "/uploads/hero-img.jpg",
            publicId: "seed_news_4"
          },
          category: "General",
          tags: ["Interview", "Kolawole Yusuf", "Player Spotlight"],
          isFeatured: false,
          views: 95
        }
      ];
      await News.insertMany(newsArticles);
      console.log("Successfully seeded news articles.");
    }

    const matchesCount = await Match.countDocuments();
    if (matchesCount === 0) {
      console.log("Seeding initial matches...");
      const matches = [
        {
          homeTeam: {
            name: "Dokkal Khairu FC",
            logo: { url: "/uploads/club_logo_crest_1782203456122.jpg", publicId: "" }
          },
          awayTeam: {
            name: "Osun United",
            logo: { url: "/uploads/club_logo_crest_1782203456122.jpg", publicId: "" }
          },
          homeScore: null,
          awayScore: null,
          venue: "Ife Grand Resort Pitch, Ilé-Ifẹ̀",
          matchDate: new Date("2026-06-28T16:00:00Z"),
          competition: "OSFA League",
          status: "upcoming",
          matchweek: 12
        },
        {
          homeTeam: {
            name: "Crown FC",
            logo: { url: "/uploads/club_logo_crest_1782203456122.jpg", publicId: "" }
          },
          awayTeam: {
            name: "Dokkal Khairu FC",
            logo: { url: "/uploads/club_logo_crest_1782203456122.jpg", publicId: "" }
          },
          homeScore: null,
          awayScore: null,
          venue: "Ogbomosho Stadium",
          matchDate: new Date("2026-07-04T15:30:00Z"),
          competition: "Friendly Match",
          status: "upcoming",
          matchweek: 13
        },
        {
          homeTeam: {
            name: "Dokkal Khairu FC",
            logo: { url: "/uploads/club_logo_crest_1782203456122.jpg", publicId: "" }
          },
          awayTeam: {
            name: "Prime FC",
            logo: { url: "/uploads/club_logo_crest_1782203456122.jpg", publicId: "" }
          },
          homeScore: 2,
          awayScore: 1,
          venue: "Ife Township Stadium, Ilé-Ifẹ̀",
          matchDate: new Date("2026-06-18T16:00:00Z"),
          competition: "OSFA League",
          status: "completed",
          matchweek: 11,
          highlights: "https://youtube.com"
        },
        {
          homeTeam: {
            name: "Dokkal Khairu FC",
            logo: { url: "/uploads/club_logo_crest_1782203456122.jpg", publicId: "" }
          },
          awayTeam: {
            name: "Ife City FC",
            logo: { url: "/uploads/club_logo_crest_1782203456122.jpg", publicId: "" }
          },
          homeScore: 3,
          awayScore: 0,
          venue: "Ife Grand Resort Pitch, Ilé-Ifẹ̀",
          matchDate: new Date("2026-06-12T15:00:00Z"),
          competition: "Local Derby Cup",
          status: "completed",
          matchweek: 10,
          highlights: "https://youtube.com"
        },
        {
          homeTeam: {
            name: "Remo Stars Feeders",
            logo: { url: "/uploads/club_logo_crest_1782203456122.jpg", publicId: "" }
          },
          awayTeam: {
            name: "Dokkal Khairu FC",
            logo: { url: "/uploads/club_logo_crest_1782203456122.jpg", publicId: "" }
          },
          homeScore: 1,
          awayScore: 2,
          venue: "Abeokuta Township Stadium",
          matchDate: new Date("2026-06-05T16:00:00Z"),
          competition: "OSFA Federation Cup",
          status: "completed",
          matchweek: 9
        }
      ];
      await Match.insertMany(matches);
      console.log("Successfully seeded matches.");
    }

    // Force reset players and gallery for the re-seed
    await Player.deleteMany({});
    await GalleryItem.deleteMany({});

    console.log("Seeding full players list...");
    const players = [
      { name: "OLUSEGUN ADERIBIGBE", number: 1, position: "GOALKEEPER", nationality: "Nigeria", appearances: 42, cleanSheets: 15, goals: 0, assists: 0, imageUrl: "/squad/gk-1.jpg" },
      { name: "CHIDI OKAFOR", number: 4, position: "DEFENDER", nationality: "Nigeria", appearances: 38, cleanSheets: 12, goals: 3, assists: 1, imageUrl: "/squad/def-1.jpg" },
      { name: "TUNDE BAKARE", number: 5, position: "DEFENDER", nationality: "Nigeria", appearances: 35, cleanSheets: 10, goals: 1, assists: 2, imageUrl: "/squad/def-2.jpg" },
      { name: "MUSA IBRAHIM", number: 8, position: "MIDFIELDER", nationality: "Nigeria", appearances: 40, cleanSheets: 0, goals: 7, assists: 14, imageUrl: "/squad/mid-1.jpg" },
      { name: "EMMANUEL EZE", number: 10, position: "MIDFIELDER", nationality: "Nigeria", appearances: 39, cleanSheets: 0, goals: 12, assists: 18, imageUrl: "/squad/mid-2.jpg" },
      { name: "AYO BALOGUN", number: 9, position: "FORWARD", nationality: "Nigeria", appearances: 41, cleanSheets: 0, goals: 22, assists: 6, imageUrl: "/squad/fwd-1.jpg" },
      { name: "KOLAWOLE JOHNSON", number: 11, position: "FORWARD", nationality: "Nigeria", appearances: 37, cleanSheets: 0, goals: 15, assists: 9, imageUrl: "/squad/fwd-2.jpg" },
      { name: "VICTOR ADAMS", number: 7, position: "FORWARD", nationality: "Nigeria", appearances: 30, cleanSheets: 0, goals: 8, assists: 12, imageUrl: "/squad/fwd-3.jpg" },
    ];
    await Player.insertMany(players);
    console.log("Successfully seeded players.");

    console.log("Seeding full gallery items...");
    const items = [
      { title: 'Goal Celebration vs Sunshine Stars', category: 'Match Action', imageUrl: '/gallery/action-1.jpg', type: 'image', date: new Date() },
      { title: 'Pre-season Conditioning', category: 'Training', imageUrl: '/gallery/training-1.jpg', type: 'image', date: new Date() },
      { title: 'Derby Day Highlights', category: 'Match Action', imageUrl: '/gallery/action-2.jpg', type: 'video', date: new Date() },
      { title: 'The Khairu Faithfuls', category: 'Fans', imageUrl: '/gallery/fans-1.jpg', type: 'image', date: new Date() },
      { title: 'Tactical Setup', category: 'Training', imageUrl: '/gallery/training-2.jpg', type: 'image', date: new Date() },
      { title: 'Crucial Save', category: 'Match Action', imageUrl: '/gallery/action-3.jpg', type: 'image', date: new Date() },
    ];
    await GalleryItem.insertMany(items);
    console.log("Successfully seeded gallery items.");
  } catch (err) {
    console.error("Error seeding initial data:", err);
  }
}
