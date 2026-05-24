
import argparse, sys, os, logging, json
from .core import run_crawl, run_digest
from .config import DEFAULT_DB

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

def main():
    p = argparse.ArgumentParser(prog="rumorwatch", description="Deal Rumor & Pre-Announcement Tracker")
    sub = p.add_subparsers(dest="cmd", required=True)

    c1 = sub.add_parser("crawl", help="Crawl sources and score items")
    c1.add_argument("--sources", required=True, help="Path to sources.yaml")
    c1.add_argument("--db", default=DEFAULT_DB, help="SQLite DB path (default: rumorwatch.db)")
    c1.add_argument("--verbose", action="store_true")

    c2 = sub.add_parser("digest", help="Generate & optionally email digest")
    c2.add_argument("--period", choices=["daily", "weekly"], default="daily")
    c2.add_argument("--to", nargs="*", help="Recipient email addresses (space separated)")
    c2.add_argument("--min-score", type=float, default=5.0, help="Minimum score to include")
    c2.add_argument("--db", default=DEFAULT_DB, help="SQLite DB path")

    args = p.parse_args()
    if args.cmd == "crawl":
        if args.verbose:
            logging.getLogger().setLevel(logging.DEBUG)
        run_crawl(args.sources, db_path=args.db)
        print("Crawl complete.")
    elif args.cmd == "digest":
        subject, html = run_digest(period=args.period, to_addrs=args.to, min_score=args.min_score, db_path=args.db)
        # Always print to stdout for piping / debugging
        print(subject)
        print("="*80)
        print(html)

if __name__ == "__main__":
    main()
